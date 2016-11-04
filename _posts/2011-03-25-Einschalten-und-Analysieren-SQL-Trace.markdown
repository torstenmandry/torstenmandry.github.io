---
title: "Einschalten und Analysieren SQL-Trace"
layout: post
date: 2011-03-25
image: /assets/images/markdown.jpg
headerImage: false
tag:
- sql
- oracle rdbms
blog: true
author: torstenmandry
description:  

---


Bei einem unperformanten SQL-Statement können die Ausgaben eines 
SQL-Traces nützliche Informationen geben. Hier die kurze Anleitung, wie 
ich das Tracing über SQL*Plus aktiviere und wie ich anschließend die 
Trace-Daten auswerte.

Wichtig: Der Schema-User unter dem ich das SQL-Statement ausführen will, 
muss die Berechtigung `ALTER SESSION` besitzen

1. Starten von SQL*Plus und anmelden als Schema-User
2. ALTER SESSION SET SQL_TRACE=TRUE;
3. Ausführen des/der Statement/s
4. Beenden der SQL*Plus Session (Exit)
5. Auf der Datenbank-Maschine per Kommandozeile ins Verzeichnis ORACLE_HOME/admin/<DB-Name>/udump wechseln
6. Zuletzt geschriebenes Trace-File (.trc) identifizieren (ist etwas einfacher wenn zuvor "alter session set tracefile_identifier = clausen;" ausgeführt wurde, dann ist der identifier im Tracefilenamen enthalten)
7. Kommando tkprof <tracefile> <outputfile> sys=no

Anschließend kann das Output-File im Editor geöffnet und analysiert werden.

