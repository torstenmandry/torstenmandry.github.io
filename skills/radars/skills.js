//This is the title for your window tab, and your Radar
// document.title = "Torsten Mandry - Skills";


//This is the concentic circles that want on your radar
var radar_arcs = [
  {'r':100,'name':'Kernkompetenz'}
  ,{'r':200,'name':'Erfahrung'}
  ,{'r':300,'name':'Wissen'}
  ,{'r':400,'name':'Interesse'}
  // ,{'r':500,'name':'Possible Extra if you want it'}
];

//This is your raw data
//
// Key
//
// movement:
//   t = moved
//   c = stayed put
//
// blipSize:
//  intValue; This is optional, if you omit this property, then your blip will be size 70.
//            This give you the ability to be able to indicate information by blip size too
//
// url:
// StringValue : This is optional, If you add it then your blips will be clickable to some URL
//
// pc: polar coordinates
//     r = distance away from origin ("radial coordinate")
//     - Each level is 100 points away from origin
//     t = angle of the point from origin ("angular coordinate")
//     - 0 degrees is due east
//
// Coarse-grained quadrants
// - Techniques: elements of a software development process, such as experience design; and ways of structuring software, such micro-services.
// - Tools: components, such as databases, software development tools, such as versions control systems; or more generic categories of tools, such as the notion of polyglot persistance.
// - Platforms: things that we build software on top of: mobile technologies like Android, virtual platforms like the JVM, or generic kinds of platforms like hybrid clouds
// - Programming Languages and Frameworks
//
// Rings:
// - Adopt: blips you should be using now; proven and mature for use
// - Trial: blips ready for use, but not as completely proven as those in the adopt ring; use on a trial basis, to decide whether they should be part of your toolkit
// - Assess: things that you should look at closely, but not necessarily trial yet - unless you think they would be a particularly good fit for you
// - Hold: things that are getting attention in the industry, but not ready for use; sometimes they are not mature enough yet, sometimes they are irredeemably flawed
//      Note: there's no "avoid" ring, but throw things in the hold ring that people shouldn't use.

var h = 1200;
var w = 1200;

var radar_data = [
  { quadrant: "Werkzeuge",
    left :45,
    top : 18,
    color : "#DC6F1D",
    items : [
      // Kernkompetenz
      { name: "Eclipse",                        pc: { r:  30, t: 110 }, movement: "c" },
      { name: "IntelliJ IDEA",                  pc: { r:  20, t: 150 }, movement: "c" },
      { name: "Git",                            pc: { r:  50, t: 130 }, movement: "c" },
      { name: "Jenkins",                        pc: { r:  60, t: 150 }, movement: "c" },
      { name: "Maven",                          pc: { r:  80, t: 100 }, movement: "c" },

      // Praktische Erfahrung
      { name: "SVN",                            pc: { r: 110, t: 120 }, movement: "c" },
      { name: "ORCAS",                          pc: { r: 110, t: 160 }, movement: "c" },
      { name: "Ant",                            pc: { r: 120, t: 140 }, movement: "c" },
      { name: "JIRA (Agile)",                   pc: { r: 130, t: 100 }, movement: "c" },
      { name: "TOAD",                           pc: { r: 130, t: 170 }, movement: "c" },
      { name: "MagicDraw",                      pc: { r: 140, t: 130 }, movement: "c" },
      { name: "Enterprise Architect",           pc: { r: 150, t: 175 }, movement: "c" },
      { name: "Checkstyle",                     pc: { r: 160, t: 150 }, movement: "c" },
      { name: "Liquibase",                      pc: { r: 160, t: 110 }, movement: "c" },
      { name: "FindBugs",                       pc: { r: 170, t: 120 }, movement: "c" },
      { name: "SQL Developer",                  pc: { r: 180, t: 140 }, movement: "c" },
      { name: "Sonar",                          pc: { r: 190, t: 170 }, movement: "c" },
      { name: "MS Project",                     pc: { r: 199, t: 110 }, movement: "c" },
      { name: "CVS",                            pc: { r: 199, t: 130 }, movement: "c" },
      { name: "TeamCity",                       pc: { r: 199, t: 160 }, movement: "c" },

      // Theoretisches Wissen
      { name: "Gradle",                         pc: { r: 230, t: 100 }, movement: "c" },
      { name: "Puppet",                         pc: { r: 230, t: 120 }, movement: "c" },
      { name: "Chef",                           pc: { r: 230, t: 140 }, movement: "c" },
      { name: "Ansible",                        pc: { r: 230, t: 170 }, movement: "c" },

      // Interesse
      // { name: "",                           pc: { r: 330, t: 190 }, movement: "c" },
    ]
  },
  { quadrant: "Infrastruktur",
    color : "#B70062",
    left  : (w-200+30),
    top : 18,
    items : [
      // Kernkompetenz
      { name: "Tomcat",                         pc: { r:  60, t:  10 }, movement: "c" },
      { name: "Oracle RDBMS",                   pc: { r:  40, t:  70 }, movement: "c" },

      // Praktische Erfahrung
      { name: "mySQL",                          pc: { r: 120, t:  40 }, movement: "c" },
      { name: "Apache httpd",                   pc: { r: 130, t:  80 }, movement: "c" },
      { name: "Linux",                          pc: { r: 140, t:  10 }, movement: "c" },
      { name: "VirtualBox",                     pc: { r: 150, t:  50 }, movement: "c" },
      { name: "Business Objects",               pc: { r: 170, t:  70 }, movement: "c" },
      { name: "WebLogic",                       pc: { r: 170, t:  40 }, movement: "c" },
      { name: "VMWare",                         pc: { r: 180, t:  60 }, movement: "c" },

      // Theoretisches Wissen
      { name: "Gradle",                         pc: { r: 230, t:  10 }, movement: "c" },
      { name: "Puppet",                         pc: { r: 230, t:  30 }, movement: "c" },
      { name: "Chef",                           pc: { r: 230, t:  60 }, movement: "c" },
      { name: "Ansible",                        pc: { r: 230, t:  80 }, movement: "c" },

      // Interesse
      // { name: "",                           pc: { r: 330, t: 190 }, movement: "c" },
    ]
  },
  { quadrant: "Sprachen & Frameworks",
    left : 45,
    top : (h/2 + 18),
    color : "#8FA227",
    items : [
      // Kernkompetenz
      { name: "Java",               pc: { r:  10, t: 220 }, movement: "c" },
      { name: "JUnit",              pc: { r:  20, t: 240 }, movement: "c" },
      { name: "SQL",                pc: { r:  30, t: 210 }, movement: "c" },
      { name: "JDBC",               pc: { r:  60, t: 270 }, movement: "c" },
      { name: "JPA",                pc: { r:  60, t: 230 }, movement: "c" },
      { name: "XML",                pc: { r:  75, t: 210 }, movement: "c" },
      { name: "HTML",               pc: { r:  80, t: 190 }, movement: "c" },
      { name: "Mockito",            pc: { r:  80, t: 240 }, movement: "c" },
      { name: "HTTP",               pc: { r:  90, t: 260 }, movement: "c" },
      { name: "Spring",             pc: { r:  99, t: 210 }, movement: "c" },

      // Praktische Erfahrung
      { name: "JSF/Richfaces",      pc: { r: 100, t: 190 }, movement: "c" },
      { name: "Hibernate",          pc: { r: 100, t: 210 }, movement: "c" },
      { name: "Selenium/WebDriver", pc: { r: 110, t: 230 }, movement: "c" },
      { name: "PL/SQL",             pc: { r: 120, t: 260 }, movement: "c" },
      { name: "SOAP",               pc: { r: 120, t: 220 }, movement: "c" },
      { name: "Shell/Bash",         pc: { r: 130, t: 240 }, movement: "c" },
      { name: "JavaScript",         pc: { r: 130, t: 190 }, movement: "c" },
      { name: "jQuery",             pc: { r: 140, t: 210 }, movement: "c" },
      { name: "JasperReports",      pc: { r: 160, t: 240 }, movement: "c" },
      { name: "Swing",              pc: { r: 160, t: 190 }, movement: "c" },
      { name: "Perl",               pc: { r: 170, t: 220 }, movement: "c" },
      { name: "Struts 1",           pc: { r: 180, t: 250 }, movement: "c" },
      { name: "XSLT",               pc: { r: 180, t: 210 }, movement: "c" },
      { name: "Spring Security",    pc: { r: 190, t: 190 }, movement: "c" },
      { name: "Groovy/Grails",      pc: { r: 190, t: 230 }, movement: "c" },

      // Theoretisches Wissen
      { name: "HTML5",              pc: { r: 210, t: 210 }, movement: "c" },
      { name: "Spring Boot",        pc: { r: 210, t: 265 }, movement: "c" },
      { name: "Twitter Bootstrap",  pc: { r: 210, t: 240 }, movement: "c" },
      { name: "JBehave/Cucumber",   pc: { r: 220, t: 200 }, movement: "c" },
      { name: "Spring WebMVC",      pc: { r: 230, t: 190 }, movement: "c" },
      { name: "PHP",                pc: { r: 240, t: 185   }, movement: "c" },
      { name: "JavaFX",             pc: { r: 240, t: 220 }, movement: "c" },
      { name: "Android",            pc: { r: 270, t: 250 }, movement: "c" },
      { name: "AngularJS",          pc: { r: 270, t: 230 }, movement: "c" },
      { name: "Spock",              pc: { r: 280, t: 190 }, movement: "c" },
      { name: "Geb",                pc: { r: 280, t: 265 }, movement: "c" },
      { name: "EJB",                pc: { r: 290, t: 260 }, movement: "c" },
      { name: "Eclipse RCP",        pc: { r: 290, t: 210 }, movement: "c" },
      { name: "JMS",                pc: { r: 290, t: 240 }, movement: "c" },

      // Interesse
      { name: "CDI",                pc: { r: 310, t: 200 }, movement: "c" },
      { name: "Ionic",              pc: { r: 310, t: 230 }, movement: "c" },
      { name: "Cordova",            pc: { r: 310, t: 260 }, movement: "c" },
      { name: "Kotlin",             pc: { r: 330, t: 210 }, movement: "c" },
      { name: "Scala",              pc: { r: 350, t: 240 }, movement: "c" },
      { name: "Ruby/JRuby",         pc: { r: 350, t: 190 }, movement: "c" },
    ]
  },
  { quadrant: "Methodik",
    left: w-200+30,
    top : (h/2 + 18),
    color : "#587486",
    items : [
      // Kernkompetenz
      { name: "OOA/OOD",                        pc: { r:  10, t: 300 }, movement: "c" },
      { name: "Clean Code",                     pc: { r:  30, t: 320 }, movement: "c" },
      { name: "TDD",                            pc: { r:  50, t: 310 }, movement: "c" },
      { name: "UML",                            pc: { r:  50, t: 340 }, movement: "c" },
      { name: "Relationale Datenmodellierung",  pc: { r:  70, t: 300 }, movement: "c" },
      { name: "SCRUM",                          pc: { r:  80, t: 320 }, movement: "c" },
      { name: "CI",                             pc: { r:  80, t: 280 }, movement: "c" },
      { name: "Continuous Learning",            pc: { r:  80, t: 350 }, movement: "c" },

      // Praktische Erfahrung
      { name: "REST",                           pc: { r: 110, t: 300 }, movement: "c" },
      { name: "Model Driven Development",       pc: { r: 120, t: 350 }, movement: "c" },
      { name: "Kanban",                         pc: { r: 130, t: 280 }, movement: "c" },
      { name: "User Stories",                   pc: { r: 140, t: 330 }, movement: "c" },
      { name: "Specification by Example",       pc: { r: 150, t: 290 }, movement: "c" },
      { name: "Rapid Application Development",  pc: { r: 160, t: 350 }, movement: "c" },
      { name: "Use Cases",                      pc: { r: 160, t: 280 }, movement: "c" },
      { name: "Infrastructure as Code",         pc: { r: 180, t: 320 }, movement: "c" },
      { name: "DevOps",                         pc: { r: 190, t: 340 }, movement: "c" },

      // Theoretisches Wissen
      { name: "Continuous Delivery",            pc: { r: 210, t: 330 }, movement: "c" },
      { name: "CQRS",                           pc: { r: 220, t: 280 }, movement: "c" },
      { name: "noSQL",                          pc: { r: 220, t: 350 }, movement: "c" },
      { name: "Domain Driven Design",           pc: { r: 220, t: 320 }, movement: "c" },
      { name: "Funktionale Programmierung",     pc: { r: 240, t: 300 }, movement: "c" },
      { name: "Microservices",                  pc: { r: 240, t: 340 }, movement: "c" },
      { name: "User Story Mapping",             pc: { r: 250, t: 290 }, movement: "c" },
      { name: "Hybride Mobile Apps",            pc: { r: 250, t: 310 }, movement: "c" },
      { name: "Self-Contained Systems",         pc: { r: 270, t: 330 }, movement: "c" },
      { name: "Single Page Apps",               pc: { r: 270, t: 280 }, movement: "c" },
      { name: "Polyglot Persistence",           pc: { r: 280, t: 350 }, movement: "c" },

      // Interesse
      { name: "ROCA",                           pc: { r: 330, t: 290 }, movement: "c" },
      { name: "Resilient Software Design",      pc: { r: 350, t: 320 }, movement: "c" },
      { name: "Serverless",                     pc: { r: 380, t: 350 }, movement: "c" },
    ]
  },
];
