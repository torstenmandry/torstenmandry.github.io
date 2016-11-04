---
title: "Row-Level-Security mit Oracle Virtual Private Database"
layout: post
date: 2015-07-14 22:03
image: /assets/images/markdown.jpg
headerImage: false
tag:
- oracle rdbms
- security
- vpd
- sql
- pl/sql
blog: true
author: torstenmandry
description:  

---

Virtual Private Database (VPD) ist ein Security Feature der Oracle 
Database Enterprise Edition (eingeführt mit Version 8i, teilweise auch 
unter der Bezeichnung Fine Grained Access Control - FGAC bekannt). Es 
bietet eine sehr einfache und verlässliche Möglichkeit zur Umsetzung von 
Row-Level-Security Konzepten, d.h. der Einschränkung der Sichtbarkeit 
(und Änderbarkeit) auf Ebene einzelner Datensätze.

Beispiel Bestellsystem
----------------------

Nehmen wir als Beispiel ein Bestellsystem in welchem Kunden Aufträge 
platzieren können. Üblicherweise wird sich in der Datenbank eines solchen 
Systems eine Tabelle ORDERS mit allen Aufträgen aller Kunden wiederfinden. 
Jeder ORDER Datensatz enthält eine CUSTOMER_ID als Foreign Key auf den 
Kunden der den Auftrag platziert hat.

    +-------------+               +-------------+
    | ORDERS      |               | CUSTOMERS   |
    +-------------+               +-------------+
    | ORDER_ID    |---------------| CUSTOMER_ID |
    | CUSTOMER_ID | *           1 | NAME        |
    | ...         |               | ...         |
    +-------------+               +-------------+

In der zugehörigen Anwendung soll ein konkreter Anwender i.d.R. immer 
nur Zugriff auf seine eigenen Aufträge haben. Egal ob die Anwendung über 
einen technischen Nutzer oder mit einem personalisierten Account des 
konkreten Anwenders auf die Datenbank zugreift, sie kann (die notwendigen 
SELECT Rechte vorausgesetzt) zunächst einmal alle Datensätze aus der 
Tabelle ORDERS auslesen. 

    SQL> SELECT * FROM ORDERS;

      ORDER_ID CUSTOMER_ID ORDER_DATE
    ---------- ----------- ------------------
        100001         123 13-MAR-15
        100002         234 17-MAR-15
        100003         123 21-MAR-15
        100004         345 25-MAR-15
        ...

Es liegt oft in der Verantwortung der Anwendung nur die Datensätze des 
aktuell angemeldeten Anwenders abzufragen und anzuzeigen.

    SQL> SELECT * FROM ORDERS WHERE CUSTOMER_ID = 123;

      ORDER_ID CUSTOMER_ID ORDER_DATE
    ---------- ----------- ------------------
        100001         123 13-MAR-15
        100003         123 21-MAR-15

Verlagerung der Security Regeln in die Datenbank
------------------------------------------------

Mit VPD kann diese Verantwortung in die Datenbank verlagert werden. 
Vereinfacht ausgedrückt kümmert sich VPD darum, dass jede Query welche 
auf die geschützte Tabelle zugreift automatisch um die oben genannte 
`WHERE`-Bedingung ergänzt wird und das transparent und in jedem Fall. 

Die Verlagerung der Security Regeln in die Datenbank ist insbesondere 
dann interessant, wenn über verschiedene Wege (z.B. Applikation, 
Service-Schnittstellen und evtl. sogar direkt per SQL Client) auf die 
Daten zugegriffen wird. Security Regeln werden auf diesem Weg einmalig 
und zentral definiert/hinterlegt und in allen Fällen angewendet. Aber 
auch wenn ausschließlich eine Anwendung auf die Datenbank zugreift kann 
die Verlagerung in die Datenbank Sinn machen um den eher 
querschnittlichen Security Aspekt nicht in jedem einzelnen SQL-Statement 
der Anwendung berücksichtigen zu müssen.

Aufbau und Arbeitsweise einer VPD
---------------------------------

Nachfolgend beschreibe ich die wesentlichen Komponenten einer VPD sowie 
deren Bedeutung und Zusammenspiel anhand des konkreten Beispiels von 
oben. Um die beschriebenen Schritte ausführen zu können benötigt der 
verwendete DB User neben den üblichen Privilegien (`CREATE SESSION`, 
`CREATE TABLE`, `CREATE PROCEDURE`, usw.) die folgenden speziellen 
Privilegien:

    CREATE ANY CONTEXT
    EXECUTE ON DBMS_SESSION
    EXECUTE ON DBMS_RLS

Mit VPD ist es prinzipiell möglich alle Zugriffe (`SELECT`, `INSERT`, 
`UPDATE` und `DELETE`) auf einzelne Datensätze, und sogar auf einzelne 
Spalten, einzuschränken. Im  weiteren Verlauf betrachte ich jedoch nur 
das Lesen (`SELECT`) von vollständigen Datensätzen. Für weiterführende 
Informationen sei auf die unten aufgeführten Quellen verwiesen.

Security (Policy) Function
--------------------------

Die Security Policy Function (kurz auch Security Function) ist eine 
herkömmliche PL/SQL Function (auch Package Function möglich) welche die 
WHERE-Bedingung (Predicate) erzeugt die von VPD automatisch an die 
Queries gehängt wird. Sie definiert die Anwendungsspezifische Logik nach 
der die Security-Einschränkungen ermittelt werden. Die Function muss 
zwei Input-Parameter für den Schema- sowie den Objekt-Namen des Objects 
(Table, View, Synonym) erwarten und als Rückgabewert die `WHERE`-Bedingung 
zurückliefern, die beim Zugriff auf das Objekt verwendet werden soll. 

    CREATE OR REPLACE FUNCTION orders_sec_fnc(
               p_schema IN VARCHAR2, 
               p_object IN VARCHAR2) RETURN VARCHAR2
    IS
    BEGIN
      RETURN 'CUSTOMER_ID = ' || ;
    END orders_sec_function;
    /

Eine Security Function kann für mehrere Objekte verwendet werden, wenn 
die `WHERE`-Bedingungen identisch oder zumindest ähnlich sind. Es können 
jedoch auch individuelle Security Functions für jedes zu schützende 
Objekt definiert werden.

Application Context
-------------------

Häufig greifen Security Functions auf einen Application Context zu um 
daraus die notwendigen individuellen Informationen für die `WHERE`-Bedingung 
herauszulesen. In unserem Fall zum Beispiel die `CUSTOMER_ID` des 
zugreifenden Anwenders. Ein Application Context muss explizit angelegt 
werden und ist mit einem Package verbunden welches die API zum Ablegen 
und Auslesen von Inhalten bereitstellt.

    CREATE OR REPLACE CONTEXT orders_sec_ctx 
               USING orders_sec_ctx_pkg;
  
In meinen bisherigen Projekten erfolgt die Identifizierung  und 
Authentifizierung des Anwenders außerhalb der Datenbank in der 
Applikation. Daher muss diese die notwendigen Informationen ggf. vor der 
Ausführung einer Query in den Application Context der Datenbank schreiben. 
Als API dient das Application Context Package.

    CREATE OR REPLACE PACKAGE orders_sec_ctx_pkg IS 
      PROCEDURE set_customer_id(p_customer_id IN NUMBER);
    END;
    /
 
    CREATE OR REPLACE PACKAGE BODY orders_sec_ctx_pkg IS
      PROCEDURE set_customer_id(p_customer_id IN NUMBER)
      AS
      BEGIN
        DBMS_SESSION.SET_CONTEXT('orders_sec_ctx', 
             'customer_id', p_customer_id);
      END set_customer_id;
    END;
    /

Die Security Function kann die Customer ID des aktuellen Anwenders nun 
aus dem Application Context auslesen.

    CREATE OR REPLACE FUNCTION orders_sec_fnc(
               p_schema IN VARCHAR2, 
               p_object IN VARCHAR2) RETURN VARCHAR2
    IS
    BEGIN
             RETURN 'CUSTOMER_ID = SYS_CONTEXT(''orders_sec_ctx'', 
                                         ''customer_id'')';
    END orders_sec_fnc;
    /

Security Policy
---------------

Die Security Policy verbindet die Security Function mit einem zu 
schützenden Objekt (Tabelle, View, Synonym). Sie wird mit Hilfe des 
Packages `DBMS_RLS` angelegt. 
Die Parameter Object Schema und Name definieren dabei das zu schützende 
Objekt, in unserem Fall die `ORDERS` Tabelle.
Über den Parameter Policy Name gebe ich der Policy einen sprechenden 
Namen.
Die Parameter Function Schema und Policy Function definieren die zu 
verwendende Security Policy Function.
Der Parameter Statement Types definiert, dass die Policy ausschließlich 
für `SELECT` Statements angewendet werden soll.

    BEGIN
      DBMS_RLS.ADD_POLICY (
        object_schema    => 'vpd_owner', 
        object_name      => 'orders', 
        policy_name      => 'orders_sec_policy', 
        function_schema  => 'vpd_owner',
        policy_function  => 'orders_sec_fnc', 
        statement_types  => 'select');
    END;
    / 

VPD in Aktion
-------------

Mit dem Anlegen der Security Policy ist VPD für diese Tabelle "scharf 
geschaltet". Das wird unmittelbar sichtbar wenn ich auf die `ORDERS` 
Tabelle zugreife.

    SELECT * FROM ORDERS;
 
     no rows selected

Standardmäßig sehe ich erst einmal gar nichts mehr. Erst wenn ich eine 
gültige Customer ID in den Application Context schreibe kann ich danach 
die zugehörigen Ergebnisse sehen.

    BEGIN
      orders_sec_ctx_pkg.set_customer_id(123);
    END;
    /
 
    SELECT * FROM ORDERS;
 
      ORDER_ID CUSTOMER_ID ORDER_DATE
    ---------- ----------- ------------------
        100001         123 13-MAR-15
        100003         123 21-MAR-15
 
 
[1]: http://www.oracle.com/technetwork/database/security/index-088277.html
[2]: http://www.oracle.com/webfolder/technetwork/de/community/dbadmin/tipps/vpd/index.html
[3]: http://docs.oracle.com/cd/B28359_01/network.111/b28531/vpd.htm#DBSEG80081