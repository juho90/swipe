# swipe
react-typescript

1. [개요](#개요)
2. [개발 환경](#Aws-Ubuntu-Nginx-React)
2. [서버 생성](#Aws생성)
3. [웹 서버 설치](#Nginx설치)
3. [Swipe 설치]()
4. [환경 설정]()
5. [서버 프로그램 실행]()
6. [도커 지원]()

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
또한, Apache에 비해 가렵다.
때문에 요즘 가볍움을 추구하는 클라우드에서 Ubuntu와 함께 nginx가 떠오르고 있다.
즉, 점점 nginx의 지원이 활발해지고 있는 추세이다.
클라우드를 목표로 하면 Apache를 사용할 이유가 없다.

### React (서버 런타임 프로그램)



## Aws-Ubuntu-Nginx-React

1. 가상 실행 환경에서 React로 웹 앱을 개발.
2. AWS에서 제공하는 클라우드 서버에 Ubuntu 운영체제를 설치.
3. 웹 서비스를 위한 웹 서버 프로그램 Nginx를 설치.
4. React 웹 앱을 설치 및 실행.
5. Nginx와 React를 연동.

스스로가 웹 서버 프로그램인 Nginx가 네트워크 어플리케이션인 React와 연동하는 이유는 복잡한 실행 구조에서 서로 역할을 다르게 할당하여 복잡성을 줄이려는 목적이다. React 자체로도 웹 서비스를 제공할 수 있지만 Nginx를 경유하면 유지 보수 차원에서 많은 이점이 생긴다. 이점에는 로드밸런싱, 어플리케이션 확장, HTTPS 지원, 자원공유, 보안 등이 있다. 항목 중에 React에서도 지원되는 기능들이 있지만 Nginx를 통해서 역할을 분담하고 복잡성을 줄이는데 의의가 있다.

React와 Nginx의 연동이 가능한 이유는 Nginx가 프록시 서버의 기능을 가지고 있기 때문이다. Nginx는 진입점으로서 통신에 대한 많은 권한을 가지고 있다. 권한 중 웹 상의 통신 흐름을 다른 곳으로 흘려보내는 권한이 있다. Nginx로 들어온 정보를 React로 보냄으로써 연동이 성립한다.

## Aws생성



## Nginx설치

### 패키지 저장소 사용

명령 :

    1. 파일 생성 후 편집 :
      cat > /etc/apt/sources.list.d/nginx.list
    2. 파일 내용 삽입 :
      deb http://nginx.org/packages/mainline/ubuntu/ xenial nginx
      deb-src http://nginx.org/packages/mainline/ubuntu/ xenial nginx
    3. 저장 후 종료 :
      ctrl + d

설명 : 

- 리눅스의 패키지 관리 시스템인 apt에게 공식 NGINX 패키지 저장소를 사용하도록 지시.

### 패키지 설치

명령 :

    wget http://nginx.org/keys/nginx_signing.key
    apt-key add nginx_signing.key
    apt-get update
    apt-get install -y nginx
    /etc/init.d/nginx start
    curl localhost

설명 :

- wget 명령은 NGINX GPG 패키지 서명 키를 다운로드 하고 이를 apt로 가져옴.
- 서명 키를 apt로 제공하면 저장소 시스템에서 패키지의 유효성을 검사.
- apt-get update 명령은 apt 시스템이 알려진 저장소에서 패키지 목록을 새로 고치도록 지시.
- 패키지 목록을 새로 고친 후 공식 NGINX 저장소에서 NGINX Open Source를 설치.
- 설치 한 후 최종 명령이 NGINX를 시작.
- 설치 후 실행 확인
