# swipe
react-typescript

1. [개요](#개요)
2. [개발 환경](#Aws-Ubuntu-Nginx-React)
3. [서버 생성](#Aws)
4. [웹 서버](#Nginx)
5. [웹 앱](#React)
6. [지속적 통합 관리](#Jenkins)
7. [환경 설정]()
8. [도커 지원]()

## 개요

개인 공부용

- [Aws](https://aws.amazon.com)
- [Ubuntu](https://www.ubuntu.com)
- [Nginx](https://nginx.org)
- [React](https://reactjs.org)

### Swipe Brick Breaker RPG

이 프로젝트는 기존 벽돌깨기 게임에서 성장요소를 추가한 게임이다.
게임은 재미있지만 변화 없이 매번 새로 플레이 하는 것이 시간도 아깝고 가치를 못 느껴서 RPG로 만들었다.

### Amazon Web Services (가상 PC 클라우드 서버)

약칭 AWS를 선택한 이유

클라우드 서버를 이용하는 이유는 물리 서버를 구매하는 것보다 여러 면(유지보수 및 관리, 사후처리, 민첩성 등등)에서 비용이 싸기 때문이다.
가상 PC 클라우드 서버를 제공하는 업체는 대표적으로 4곳이다.
Amazon의 Amazon Web Services, MS의 Azure, Google의 Google Cloud, IBM의 IBM cloud 등이 있다.
이들 중 가장 먼저 클라우드 서비스 제공이 시작된 곳은 AWS이며, 세계적으로 가장 많이 이용되는 클라우드 서비스 기업이다.
그러나 2019년 1월 기준 MS의 Azure가 뒤따라가고 있다.
Azure도 해보면 좋겠지만 주변 AWS 환경이기 때문에 학습겸 이용하겠다.

### Ubuntu 16.04 LTS / Xenial Xerus (운영체제)

우분투 계열을 선택한 이유

리눅스 운영체제에는 Debian/Ubuntu 계열과 RedHat/CentOS 계열이 있다.
더 있지만 두 계열은 대표적인 리눅스 운영체제이다.
두 계열을 구분짓는 가장 뚜렷한 특징은 안정성이다.
CentOS 계열이 유지관리기간(업데이트가 빈번하지 않음)이 더 길어 안정성을 얻는다.
그러나 다루기 복잡하다는 단점이 있고, 지원이 활발하지 않다.
그럼에도 점유율은 1위다.
점유율 1위이고 안정성이 검증된 운영체제보다 Debian/Ubuntu 계열을 선택한 이유는 더 나은 미래의 가능성을 보았기 때문이다.
특히, Ubuntu는 클라우드 환경에서 지원이 활발하고 다루기 쉽다는 장점이 있다.
또한, 패키지 설치가 용이하다.
클라우드 서버가 주를 이루고 있는 요즘 리눅스 운영체제는 다루기 쉽고 지원이 활발한 Ubuntu 중심이 되어가고 있다.

### Nginx (웹 서버 프로그램)

nginx(엔진엑스)를 선택한 이유

웹 서버 프로그램에는 대표적으로 Apache와 nginx가 있다.
Apache와 nginx를 구분짓는 가장 큰 특징은 확장성과 성능이다.
Apache는 많은 모듈(기능)을 지원하고 있어 기능 추가가 용이하다.
그러나 개발이 쉽고 용이하지만 큰 단점 하나가 있다.
Apache는 프로세스 기반 처리 구조이다.
Apache는 클라이언트 요청 하나당 프로세스를 생성하여 처리한다.
프로세스의 비동기는 CPU에 의존한다.
CPU는 코어 하나 당 하나의 프로세스를 처리한다.
프로세스 기반의 취약점은 메모리 낭비와 Context Switching 오버헤드이다.
CPU가 프로세스를 처리하기 위한 준비 과정을 Context Switching이라 부른다.
Context Switching은 많은 자원을 요구한다.
프로세스(= 클라이언트 요청 수)가 바뀔 때마다 Context Switching이 발생한다.
때문에 Apache는 성능면에서 불리하다.
이는 사용자가 많아질수록 두각되는 문제점이다.
그럼에도 현재 사용률이 1위인 것은 안정성과 확장성이 검증되었기 때문이다.
반면 nginx는 지원이 부족하고 확장이 용이하지 않다.
그러나 성능면에서 이벤트 기반 처리 방식을 사용한다.
이벤트 기반 처리는 프로세스 기반과 달리 동시성과 처리 속도에서 이득이다.
비동기를 프로세스가 구현하여 Context Switching이 없다.
클라이언트 요청이 들어오면 대기하고 있던 프로세스가 쓰레드로 처리한다.
쓰레드 또한 풀링이 되고 있어 메모리 낭비가 적고 빠르다.
또한, Apache에 비해 가볍다.
때문에 요즘 가벼움을 추구하는 클라우드에서 Ubuntu와 함께 nginx가 떠오르고 있다.
즉, 점점 nginx의 지원이 활발해지고 있는 추세이다.
클라우드를 목표로 하면 Apache를 사용할 이유가 없다.

### React (서버 런타임 프로그램)

React를 선택한 이유

React를 선택한 이유는 순수하게 공부가 목적이다.
React를 공부하면 좋은 이유는 React가 가진 구조 때문이다.
컴포넌트 기반으로 설계된 React는 객체 지향 프로그래밍 철학을 따르고 있다.
더불어 React와 typescript를 함께 사용하면 객체 지향 프로그래밍을 올바르게 이해하고 좋은 습관을 기를 수 있을 것이라 기대한다.

## Aws-Ubuntu-Nginx-React

1. 가상 실행 환경에서 React로 웹 앱을 개발.
2. AWS에서 제공하는 클라우드 서버에 Ubuntu 운영체제를 설치.
3. 웹 서비스를 위한 웹 서버 프로그램 Nginx를 설치.
4. React 웹 앱을 설치 및 실행.
5. Nginx와 React를 연동.

스스로가 웹 서버 프로그램인 Nginx가 네트워크 어플리케이션인 React와 연동하는 이유는 복잡한 실행 구조에서 서로 역할을 다르게 할당하여 복잡성을 줄이려는 목적이다.
React 자체로도 웹 서비스를 제공할 수 있지만 Nginx를 경유하면 유지 보수 차원에서 많은 이점이 생긴다.
이점에는 로드밸런싱, 어플리케이션 확장, HTTPS 지원, 자원공유, 보안 등이 있다.
항목 중에 React에서도 지원되는 기능들이 있지만 Nginx를 통해서 역할을 분담하고 복잡성을 줄이는데 의의가 있다.

React와 Nginx의 연동이 가능한 이유는 Nginx가 프록시 서버의 기능을 가지고 있기 때문이다.
Nginx는 진입점으로서 통신에 대한 많은 권한을 가지고 있다.
권한 중 웹 상의 통신 흐름을 다른 곳으로 흘려보내는 권한이 있다.
Nginx로 들어온 정보를 React로 보냄으로써 연동이 성립한다.

## Aws

명령 :

    1. https://aws.amazon.com에 접속 및 가입
    2. 가입 후 AWS Management Console로 이동
    3. 전체 서비스 > 컴퓨팅 > EC2 인스턴스 생성
    4. Ubuntu Server 16.04 LTS 설치
    5. ssh를 등록
    6. 접속 후 apt-get update 실행

설명 :

- 가성 PC 서버 서비스를 제공받기 위해 기업에 가입하고 서비스를 생성.
- 우분투 설치 패키지 업데이트.

## Nginx

### 패키지 저장소 사용

명령 :

    # cat > /etc/apt/sources.list.d/nginx.list
    [copy and paste 'deb http://nginx.org/packages/mainline/ubuntu/ xenial nginx']
    [press key enter]
    [copy and paste 'deb-src http://nginx.org/packages/mainline/ubuntu/ xenial nginx']
    [press key enter]
    [press key 'ctrl + d']

설명 : 

- 리눅스의 패키지 관리 시스템인 apt에게 공식 Nginx 패키지 저장소를 사용하도록 지시.
- 파일 생성 후 편집.
- 저장 후 편집 종료.

### 설치 및 실행

명령 :

    # wget http://nginx.org/keys/nginx_signing.key
    # apt-key add nginx_signing.key
    # apt-get update
    # apt-get install -y nginx
    # /etc/init.d/nginx start
    # curl localhost

설명 :

- wget 명령은 Nginx GPG 패키지 서명 키를 다운로드 하고 이를 apt로 가져옴.
	- *서명 키를 apt에게 제공하면 저장소 시스템에서 패키지의 유효성을 검사.*
- apt-get update 명령은 apt 시스템이 알려진 저장소에서 패키지 목록을 새로 고치도록 지시.
- Nginx 설치.
- Nginx 실행.
- 설치 후 실행 확인.

## React

### 설치

명령 :

    # curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    # apt-get install -y nodejs
    # git clone https://github.com/juho90/swipe.git
    # cd swipe
    # npm install
    # npm run build

설명 : 

- React를 위해 Nodejs 10.x 버전을 사용하도록 설정.
- Nodejs 설치.
    - *npm 설치 X, npm이 포함되어 있음.*
- 저장소로부터 웹 앱 다운로드.
- 종속된 npm 패키지 설치.
- 웹 앱 프로덕션 빌드.

### 서비스

Nginx가 프록시 서버로서 React와 연동하여 서버스를 구현하는 방법도 있지만 Nginx는 기본적으로 웹 서비스 프로그램이다.
그리고 React는 웹 서비스의 기본적인 형태와 유사하게 웹 앱을 빌드해준다.
이런 형태는 프록시 서버를 통해 연결되는 오버헤드를 줄인다.
또한 Nginx를 통해 빌드된 React를 배포하는 일은 간단하다.

명령 : 

    # cd swipe
    # cat nginx-swipe.conf
    [edit nginx-swipe.conf for myconfig]
    # cat /etc/nginx/nginx.conf
    [remove 'include /etc/nginx/sites-enabled/*' in http block]
    [add 'include /etc/nginx/conf.d/*.conf' in http block]
    # ls -al /etc/nginx/conf.d/
    [check for port already in use]
    # cp ./nginx-swipe.conf /etc/nginx/conf.d/
    # nginx -s reload

설명 : 

- 웹 앱 프로젝트 폴더로 이동
- `nginx-swipe.conf` 파일 확인.
    - *내 설정에 맞게 `nginx-swipe.conf` 파일을 편집.*
- `/etc/nginx/nginx.conf` 파일 확인.
    - `/etc/nginx/nginx.conf` 파일의 http 블록에서 `include /etc/nginx/sites-enabled/*` 내용 제거.
        - *더 이상 사용되지 않는 설정.*
    - `/etc/nginx/nginx.conf` 파일의 http 블록에서 'include /etc/nginx/conf.d/*.conf' 내용 추가.
        - *기본적으로 포함되어 있지만 없는 경우.*
        - *호스트 환경에서 `/etc/nginx/conf.d/\*.conf` 에 포함된 설정을 사용하겠다는 의미.*
- `/etc/nginx/conf.d/` 디렉토리 검색.
    - *이미 사용중인 포트가 있는지 확인.*
- `nginx-swipe.conf` 내용을 `/etc/nginx/conf.d/` 폴더로 복사.
- 설정을 적용 후 Nginx 재시작.

> `nginx.conf` 파일 또는 `conf.d` 디렉토리에 대한 자세한 내용은 docs/Complete-NGINX-Cookbook-2019.pdf 문서 참고.

### In nginx location

기본적으로 React의 정적 경로는 `/static`으로 되어있다.
때문에 React를 배포할 때 Nginx location을 할당하면 css 또는 js를 찾을 수 없다.
`/mylocation/static`에서 찾아야 함으로 경로가 다르다.
그래서 빌드하기 전에 `package.json`에서 다음을 추가한다.

- "homepage": "http://myhost/mylocation"

이 후, React는 css 또는 js를 `/mylocation/static`에서 탐색한다.

## Jenkins

### 설치 및 실행

명령 :

    # apt-get update
    # apt-get install -y openjdk-8-jre-headless
    # wget -q -O - https://pkg.jenkins.io/debian/jenkins-ci.org.key | sudo apt-key add -
    # sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
    # apt-get update
    # apt-get install -y jenkins
    # /etc/init.d/jenkins start
    # curl localhost:8080

설명 : 

- Jenkins를 위해 Java8 설치.
- apt가 알려진 저장소로부터 Jenkins 패키지를 받아오도록 설정 후 유효성 검사.
- Jenkins 설치.
- Jenkins 실행.
- 설치 후 실행 확인.

### 서비스

여기서는 Nginx의 프록시 서버 기능을 사용한다.
그러나 루트 경로엔 이미 웹 앱이 연결되어 있기 때문에 다른 경로를 사용해야 한다.
외부 접속 경로 `http://myhost/jenkins`와 Jenkins 접속 경로 `http://localhost:8080/jenkins`를 중계한다.

명령 :

    # vi /etc/default/jenkins
    [edit JENKINS_ARGS="..." as JENKINS_ARGS="... --prefix=$PREFIX"]
    # service jenkins restart
    # cd swipe
    # cat nginx-swipe.conf
    [edit nginx-swipe.conf for myconfig]
    # cp ./nginx-swipe.conf /etc/nginx/conf.d/
    # nginx -s reload

설명 : 

- `/etc/default/jenkins` 설정파일에서 Jenkins 실행 파라미티에 `--prefix`를 포합하도록 수정.
    1. `PREFIX=/$NAME`
    2. `NAME=jenkins`
    3. `--prefix`는 `/jenkins`와 같다.
    4. `--prefix`는 `http://localhost:8080/--prefix`의 역할을 한다.
- Jenkins 재시작.
- Nginx 설정을 확인.
- 설정을 적용 후 Nginx 재시작.

### 시작하기

1. Jenkins가 설치되면 브라우저에서 `http://myhost/jenkins`로 접속.
2. 'Unlock Jenkins' 페이지가 보이면 Jenkins가 설치된 OS 콘솔에서 다음 명령을 입력.
	- `cat /var/lib/jenkins/secrets/initialAdminPassword` 
	- *tip : 위 명령 실행 시 보이는 문자열이 Jenkins가 요구하는 비밀번호.*
3. 비밀번호 입력 후 다음 스텝으로 진행.
4. 'Install suggested plugins'을 클릭하고 플러그인이 모두 설치되면 다음 스텝으로 진행.
	- *tip : 이 프로젝트에서 필요한 Pipeline, GitHub 플러그인이 기본적으로 설치됨.*
5. 'Create first admin user' 페이지에서 관리자용 계정을 생성.
6. 'Instance configuration' 페이지에서 유효한 url을 설정.
	- *tip : 이 후 다시 설정할 수 있기 때문에 기본 상태 스킵.*
7. 'Start using Jenkins' 버튼을 클릭하고 Jenkins 시작.

### 프로젝트 생성 및 설정

----------

GitHub 특정 브랜치에 소스가 커밋되면 Jenkins가 반응하여 로컬에서 소스를 내려받고 웹 앱을 빌드 및 테스트 후 엔진엑스 서비스 재시작.

#### 프로젝트 생성

1. '새로운 Item' 메뉴 클릭.
2. 프로젝트 이름 입력.
	- *tip : 홈메뉴에 노출된 이름.*
3. 구성 중 'Pipelines' 선택 후 OK 버튼 클릭.

