  @echo off
  echo -------------------------------------------------------------------------
  echo.
  echo                   _    _  _              __  __   ____
  echo                  ^| ^|  ^| ^|(_)            ^|  \/  ^| / __ \ 
  echo                  ^| ^|__^| ^| _ __   __ ___ ^| \  / ^|^| ^|  ^| ^|
  echo                  ^|  __  ^|^| ^|\ \ / // _ \^| ^|\/^| ^|^| ^|  ^| ^|
  echo                  ^| ^|  ^| ^|^| ^| \ V /^|  __/^| ^|  ^| ^|^| ^|__^| ^|
  echo                  ^|_^|  ^|_^|^|_^|  \_/  \___^|^|_^|  ^|_^| \___\_\
  echo.
  echo -------------------------------------------------------------------------
  echo.
  echo   HiveMQ Start Script for Windows v1.2
  echo.

  java -version >nul 2>&1
  if errorlevel 1 goto NOJAVA

  rem ########### VARIABLES
  set "JAVA_OPTS=-Djava.net.preferIPv4Stack=true -noverify %JAVA_OPTS%"
  rem Uncomment for enabling JMX Monitoring
  rem set "JAVA_OPTS=-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=9010 -Dcom.sun.management.jmxremote.local.only=false -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false %JAVA_OPTS%"

  rem Uncomment for enabling diagnostic mode
  rem set "JAVA_OPTS=-DdiagnosticMode=true %JAVA_OPTS%"


  IF "%HIVEMQ_HOME%" == "" GOTO NOPATH
  set HIVEMQ_FOLDER="%HIVEMQ_HOME%";
  GOTO CHECKPATH

:NOPATH
  SET ROOT=%~dp0
  rem Resolve is fetching the parent directory
  CALL :RESOLVE "%ROOT%\.." PARENT_ROOT
  set HIVEMQ_FOLDER="%PARENT_ROOT%"
:CHECKPATH
  set HIVEMQ_FOLDER=%HIVEMQ_FOLDER:;=%
  rem Check if directory exists
  FOR %%i IN (%HIVEMQ_FOLDER%) DO IF EXIST %%~si\NUL  GOTO CHECKFILE
  echo ERROR! HiveMQ Home Folder not found or readable.
  GOTO EXIT

:CHECKFILE
  rem Check if file exists
  FOR %%i IN (%HIVEMQ_FOLDER%/bin/hivemq.jar) DO IF EXIST %%~si  GOTO START
  echo ERROR! HiveMQ JAR not found.
  GOTO EXIT

:START
  

      echo -------------------------------------------------------------------------
      echo.
      echo   HIVEMQ_HOME: %HIVEMQ_FOLDER%
      echo.
      echo   JAVA_OPTS: %JAVA_OPTS%
      echo.
      echo -------------------------------------------------------------------------
      echo.
    
  set "JAVA_OPTS=-Dhivemq.home=%HIVEMQ_FOLDER% %JAVA_OPTS%"
  
  java %JAVA_OPTS% -jar %HIVEMQ_FOLDER%/bin/hivemq.jar
  GOTO EXIT

:NOJAVA
  echo You do not have the Java Runtime Environment installed, please install Java JRE from java.com/en/download and try again.

:EXIT
  pause

:EXIT_WO_PAUSE

GOTO :EOF

:RESOLVE
SET %2=%~f1
GOTO :EOF