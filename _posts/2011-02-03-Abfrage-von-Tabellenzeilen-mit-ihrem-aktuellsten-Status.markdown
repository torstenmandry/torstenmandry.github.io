---
title: "Abfrage von Tabellenzeilen mit ihrem aktuellsten Status"
layout: post
date: 2011-02-03
image: /assets/images/markdown.jpg
headerImage: false
tag:
- sql
- oracle rdbms
blog: true
author: torstenmandry
description:  

---

Ich habe eine Tabelle mit Item-Datensätzen und eine weitere mit mehreren 
Status-Datensätzen dazu, woraus mich jedoch nur der letzte/aktuellste 
interessiert.

{% highlight sql %}
DROP TABLE status;
DROP TABLE item;
 
CREATE TABLE item (
  item_id    NUMBER(10)    NOT NULL CONSTRAINT pk_item PRIMARY KEY,
  item_name  VARCHAR2(100) NOT NULL
);
 
CREATE TABLE status (
  status_id     NUMBER(10)    NOT NULL CONSTRAINT pk_status PRIMARY KEY,
  status_descr  VARCHAR2(100) NOT NULL,
  item_id       NUMBER(10)    NOT NULL,
  update_time   TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES item(item_id)
); 
 
INSERT INTO item VALUES (1, 'Item 1');
INSERT INTO item VALUES (2, 'Item 2');
INSERT INTO item VALUES (3, 'Item 3');
 
INSERT INTO status (status_id, status_descr, item_id) VALUES (1, 'Status 1 zu Item 1', 1);
INSERT INTO status (status_id, status_descr, item_id) VALUES (2, 'Status 2 zu Item 1', 1);
INSERT INTO status (status_id, status_descr, item_id) VALUES (3, 'Status 1 zu Item 2', 2);
INSERT INTO status (status_id, status_descr, item_id) VALUES (4, 'Status 1 zu Item 3', 3);
INSERT INTO status (status_id, status_descr, item_id) VALUES (5, 'Status 2 zu Item 2', 2);
INSERT INTO status (status_id, status_descr, item_id) VALUES (6, 'Status 3 zu Item 1', 1);
INSERT INTO status (status_id, status_descr, item_id) VALUES (7, 'Status 2 zu Item 3', 3);
INSERT INTO status (status_id, status_descr, item_id) VALUES (8, 'Status 3 zu Item 2', 2);
INSERT INTO status (status_id, status_descr, item_id) VALUES (9, 'Status 4 zu Item 2', 2);
{% endhighlight %}

Ich möchte nun alle Items sowie den jeweils aktuellsten Status dazu 
selektieren.

Erster Teilschritt: Abfrage aller Status und Kennzeichnung des jeweils 
aktuellsten für ein Item:

{% highlight sql %}
SELECT status_id
     , status_descr
     , update_time
     , case (
         rank() over (
           partition by item_id
               order by update_time desc
         ) )
         when 1 then 1
         else 0
       end aktuellster_status
  FROM status;
{% endhighlight %}

Vollständiges Statement welches die vorangegangene Abfrage als Sub-Select 
inkludiert:

{% highlight sql %}
SELECT *
  FROM item
  JOIN ( SELECT status_id
              , status_descr
              , item_id
              , update_time
              , case (
                  rank() over (
                    partition by item_id
                        order by update_time desc
                    ) )
                  when 1 then 1
                  else 0
                end aktuellster_status
           FROM status
       ) status USING (item_id)
 WHERE aktuellster_status = 1;
{% endhighlight %}
