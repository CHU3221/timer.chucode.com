# Web Modular Timer

브라우저에서 즉시 실행되는 가볍고 직관적인 다중 모듈 타이머 애플리케이션입니다.

별도의 설치나 백엔드 서버 없이 `timer.chucode.com`을 통해 언제 어디서나 바로 사용할 수 있습니다.
[Open Web Modular Timer](https://timer.chucode.com)

![Dashboard Preview](https://raw.githubusercontent.com/CHU3221/timer.chucode.com/main/docs/timer.chucode.com-logo.png)
![Dashboard Preview](https://raw.githubusercontent.com/CHU3221/timer.chucode.com/main/docs/timer.chucode.com-main.png)
![Dashboard Preview](https://raw.githubusercontent.com/CHU3221/timer.chucode.com/main/docs/timer.chucode.com-pip.png)
---

## 소개

이 프로젝트는 사용자가 여러 개의 타이머와 스톱워치를 한 화면에서 독립적으로 생성하고 관리할 수 있도록 설계된 로컬 브라우저 기반의 유틸리티 도구입니다.

별도의 프레임워크 없이 순수 Vanilla JS와 Web Standard API를 활용하여 가볍고 빠르게 동작하며, Document Picture-in-Picture 모드를 통해 다른 작업을 하면서도 타이머 상태를 쉽게 확인할 수 있습니다.

주요 목표:

* 백엔드 없는 정적 웹 애플리케이션
* 직관적인 다중 타이머 UI
* Web Audio API를 활용한 세밀한 알림음 제어
* 브라우저 기본 기능(PIP, LocalStorage)의 적극적인 활용

이 애플리케이션의 모든 설정값은 브라우저의 LocalStorage에 저장되며, 어떠한 사용자 데이터도 서버로 전송되지 않습니다.

---

## 목차

1. [주요 특징](#주요-특징)
2. [사용 기술](#사용-기술)
3. [접속 및 실행 방법](#접속-및-실행-방법)
4. [사용 방법](#사용-방법)
5. [단축키 및 편의 기능](#단축키-및-편의-기능)
6. [Credits & Open Source Licenses](#credits--open-source-licenses)

---

## 주요 특징

* **다양한 모듈 지원**: 시/분/초 단위(HMS), 초 단위(Sec) 카운트다운 및 스톱워치 모듈을 원하는 만큼 생성 가능.
* **Picture-in-Picture (PIP) 뷰**: 현재 실행 중이거나 알림이 울리는 타이머만 모아서 작은 플로팅 창으로 분리.
* **풍부한 커스텀 알림음**: 4가지 오디오 파형(Square, Sine, Triangle, Sawtooth)과 10가지 멜로디 패턴 조합 지원.
* **사용자 맞춤형 테마**: 배경, 카드, 폰트 및 강조 색상을 자유롭게 변경하고 LocalStorage에 자동 저장.
* **직관적인 조작**: 마우스 휠을 이용한 빠른 시간 설정 및 개별 루프(반복) 동작 지원.

---

## 사용 기술

### Frontend (Static Web)

* HTML5
* CSS3
* JavaScript (ES6+, Vanilla)
* Web Audio API (소리 생성 엔진)
* Document Picture-in-Picture API

### Hosting / Deployment

* Cloudflare Pages (`timer.chucode.com`)

---

## 접속 및 실행 방법

이 애플리케이션은 정적 웹 페이지로 구성되어 있어 서버 구축이나 별도의 설치 과정이 필요하지 않습니다.

### 1. 웹 서비스로 바로 이용하기 (권장)

웹 브라우저(Chrome, Edge 등 PIP를 지원하는 모던 브라우저 권장)를 열고 아래 주소로 접속합니다.

```text
https://timer.chucode.com

```

### 2. 로컬 환경에서 실행하기

오프라인 환경이거나 코드를 직접 수정해보고 싶을 경우, 소스 코드를 다운로드하여 실행할 수 있습니다.

1. 저장소를 클론하거나 코드를 다운로드합니다.
2. public 폴더 내의 `index.html` 파일을 웹 브라우저로 드래그 앤 드롭하거나 더블 클릭하여 실행합니다.

---

## 사용 방법

대시보드 좌측 패널(모바일의 경우 상단)에서 원하는 기능 모듈을 추가하고 개별적으로 제어할 수 있습니다.

### 타이머 모듈 제어

* **이름 변경**: 각 카드 상단의 타이머 이름을 클릭하여 용도에 맞게 텍스트를 수정할 수 있습니다.
* **알림음 토글 (종 아이콘)**: 해당 타이머 완료 시 소리 알림을 재생할지 여부를 결정합니다.
* **반복 토글 (화살표 아이콘)**: 타이머 완료 시 자동으로 초기 설정된 시간으로 돌아가 다시 시작하도록 설정합니다.
* **초기화 버튼 (되감기 아이콘)**: 진행 중인 타이머를 멈추고 처음 설정했던 시간으로 상태를 되돌립니다.

### 소리 및 환경 설정

* **알림 설정**: 좌측 패널 하단에서 알림음의 파형(Waveform)과 멜로디(Melody), 볼륨을 미리 들어보고 설정할 수 있습니다. (전역 적용)
* **테마 설정 (톱니바퀴 아이콘)**: 앱 전체의 색상 테마를 원하는 대로 지정할 수 있으며, '기본 테마로 초기화' 기능을 제공합니다.

---

## 단축키 및 편의 기능

* **마우스 휠 스크롤**: 타이머의 숫자 입력칸에 마우스를 올리고 휠을 위아래로 굴리면 시간을 빠르고 직관적으로 증감시킬 수 있습니다.
* **PIP 버튼**: 우측 상단의 PIP 아이콘을 누르면 화면이 분리됩니다. 타이머가 많더라도 현재 실행 중(Active)이거나 **종료되어 알림이 울리는(Alarming)** 카드만 선별하여 표시해주어 공간을 절약합니다.

---

## Credits & Open Source Licenses

이 프로젝트는 다음의 훌륭한 오픈소스 리소스와 웹 표준 기술을 바탕으로 제작되었습니다.

### Icons

* [Google Material Symbols](https://fonts.google.com/icons) (Apache License 2.0)

### Sound Engine

* Powered by **Web Audio API** (Oscillator & Gain Nodes)
