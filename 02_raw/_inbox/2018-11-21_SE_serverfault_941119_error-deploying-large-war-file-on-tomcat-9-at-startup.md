---
date: 2018-11-21
source: se
source_detail: "se post serverfault_941119 by u/John Tkaczewski"
url: "https://serverfault.com/questions/941119/error-deploying-large-war-file-on-tomcat-9-at-startup"
topic: "Error deploying large WAR file on tomcat 9, at startup"
author: John Tkaczewski
engagement: 103
created_utc: 2018-11-21T19:13:06Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Error deploying large WAR file on tomcat 9, at startup

> **Source**: https://serverfault.com/questions/941119/error-deploying-large-war-file-on-tomcat-9-at-startup

## 原始内容

JRE Version:1.8.0_191-b12
Tomcat version: 9.0.13
Windows 10

I have a large WAR file (300MB) several hundred of files, classes, struts actions etc.

When I start Tomcat 9.0.13 from a Windows Service I get the following error when I try to access the application via a URL:

21-Nov-2018 12:49:42.544 SEVERE [http-nio-9090-exec-1] org.apache.catalina.core.StandardHostValve.invoke Exception Processing /workflow/
 java.lang.SecurityException: AuthConfigFactory error: java.lang.reflect.InvocationTargetException
    at javax.security.auth.message.config.AuthConfigFactory.getFactory(AuthConfigFactory.java:85)
    at org.apache.catalina.authenticator.AuthenticatorBase.findJaspicProvider(AuthenticatorBase.java:1239)
    at org.apache.catalina.authenticator.AuthenticatorBase.getJaspicProvider(AuthenticatorBase.java:1232)
    at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:481)
    at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:139)
    at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)
    at org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:668)
    at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
    at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)
    at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:408)
    at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:66)
    at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:791)
    at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1417)
    at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)
    at java.util.concurrent.ThreadPoolExecutor.runWorker(Unknown Source)
    at java.util.concurrent.ThreadPoolExecutor$Worker.run(Unknown Source)
    at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
    at java.lang.Thread.run(Unknown Source)
Caused by: java.lang.reflect.InvocationTargetException
    at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
    at sun.reflect.NativeConstructorAccessorImpl.newInstance(Unknown Source)
    at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(Unknown Source)
    at java.lang.reflect.Constructor.newInstance(Unknown Source)
    at javax.security.auth.message.config.AuthConfigFactory$1.run(AuthConfigFactory.java:76)
    at javax.security.auth.message.config.AuthConfigFactory$1.run(AuthConfigFactory.java:67)
    at java.security.AccessController.doPrivileged(Native Method)
    at javax.security.auth.message.config.AuthConfigFactory.getFactory(AuthConfigFactory.java:66)
    ... 17 more
Caused by: java.lang.SecurityException: org.xml.sax.SAXNotRecognizedException: Feature: http://apache.org/xml/features/allow-java-encodings
    at org.apache.catalina.authenticator.jaspic.PersistentProviderRegistrations.loadProviders(PersistentProviderRegistrations.java:65)
    at org.apache.catalina.authenticator.jaspic.AuthConfigFactoryImpl.loadPersistentRegistrations(AuthConfigFactoryImpl.java:345)
    at org.apache.catalina.authenticator.jaspic.AuthConfigFactoryImpl.<init>(AuthConfigFactoryImpl.java:68)
    ... 25 more
Caused by: org.xml.sax.SAXNotRecognizedException: Feature: http://apache.org/xml/features/allow-java-encodings
    at org.apache.crimson.parser.XMLReaderImpl.setFeature(XMLReaderImpl.java:213)
    at org.apache.crimson.jaxp.SAXParserImpl.setFeatures(SAXParserImpl.java:143)
    at org.apache.crimson.jaxp.SAXParserImpl.<init>(SAXParserImpl.java:126)
    at org.apache.crimson.jaxp.SAXParserFactoryImpl.newSAXParserImpl(SAXParserFactoryImpl.java:113)
    at org.apache.crimson.jaxp.SAXParserFactoryImpl.setFeature(SAXParserFactoryImpl.java:141)
    at org.apache.tomcat.util.digester.Digester.setFeature(Digester.java:505)
    at org.apache.catalina.authenticator.jaspic.PersistentProviderRegistrations.loadProviders(PersistentProviderRegistrations.java:61)
    ... 27 more

If I wait about 2 minutes, everything starts working correctly. Tomcat 8 used to give me a nice error page saying that the resource was not ready yet, but Tomcat 9 however just shows this stack trace. 

Is there any way to have tomcat 9 do the same? Return a nicely formatted error page if a specific context is not ready yet?

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 103
- 作者: u/John Tkaczewski

<!-- 处理: 调度员 → 5 阶段 pipeline -->
