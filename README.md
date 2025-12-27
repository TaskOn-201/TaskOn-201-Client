# 🧩 TaskOn | 팀을 위한 통합 협업 관리 플랫폼

> **프로젝트 기간:** 2025.11.14 ~ 2025.12.23  
> **팀 구성:** Backend 3명 · Frontend 2명  
> **역할:** 프론트엔드 개발 (UI/UX 구현 및 주요 기능 로직 담당)


## 🗂️ 프로젝트 개요

**TaskOn**은 개인 및 팀 사용자를 위한 **통합 협업 관리 플랫폼**입니다.  
사용자는 프로젝트를 생성하고 업무(Task)를 등록하여 **참여자 배분, 진행상황 관리, 실시간 소통**을 모두 한곳에서 수행할 수 있습니다.

> 프로젝트/업무 단위로 **자동 생성되는 채팅방**,댓글 기반의 **업무 커뮤니케이션**,  
> 로그인 및 팀 관리 기능을 통해 효율적이고 유기적인 협업 경험을 제공합니다.


## ⚙️ 기술 스택

### 🖥️ Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Style:** TailwindCSS
- **State Management:** Zustand
- **Server State:** TanStack React-Query
- **UI Library:** shadcn/ui
- **Icon:** Lucide Icons
- **Drag&Drop:** dnd kit
- **API 통신:** Fetch API (JWT 기반 인증 처리)

### 🗄️ Backend
- Spring Boot · JPA · MySQL · AWS EC2/S3  
(백엔드 팀과 협업하여 API 연동 및 배포 환경 테스트)


## 🧑‍💻 주요 기능

| 기능 구분 | 설명 |
|------------|------|
| 🔐 **로그인 / 회원가입** | JWT 기반 인증 (Access/Refresh Token) |
| 🧑‍🤝‍🧑 **팀 관리** | 팀 생성, 초대, 팀원 관리 |
| 📋 **업무 관리 (Task)** | 업무 생성, 수정, 상태 변경 (TODO / IN-PROGRESS / DONE) |
| 🏷️ **업무 속성** | 우선순위(High/Medium/Low), 일정, 참여자 지정 |
| 💬 **댓글 (Comment)** | 각 업무별 의견 공유 및 커뮤니케이션 |
| 💭 **실시간 채팅** | 프로젝트/업무 자동 생성 및 STOMP 기반 실시간 메시지 송수신 (+ 개인 채팅방) |
| 🧱 **프로젝트 관리** | 프로젝트 단위로 업무와 채팅, 참여자 통합 관리 |


## 🚀 협업 방식

- **GitHub Flow** 브랜치 전략
  - `main`: 배포용 브랜치  
  - `dev`: 개발 통합 브랜치  
  - 기능별 브랜치에서 작업 후 PR  
- **PR 템플릿 및 커밋 규칙**
  - 예시: `[feat] 로그인 API 연동`
  - 코드 리뷰를 통한 품질 관리 및 버그 수정


## 🌐 주요 구현 포인트

- ✅ **JWT 인증 흐름 구현**
  - `accessToken`은 LocalStorage, `refreshToken`은 HttpOnly Cookie 관리
  - 토큰 만료 시 자동 재발급 로직 적용

- ✅ **전역 상태 관리 (Zustand)**
  - 로그인 사용자 정보(`me`) 및 인증 상태 전역 관리
  - 토큰 만료 / 갱신 시 전역 반영

- ✅ **React-Query 기반 서버 상태 관리**
  - API 요청 캐싱, 실시간 데이터 동기화, 자동 리페치 설정
  - 채팅방, 업무 리스트, 댓글 등 주요 데이터 쿼리 관리

- ✅ **공통 컴포넌트 제작**
  - Button, Input, Modal, Dropdown, Profile 등 반복되는 UI를 컴포넌트화
  - 유지보수성 및 재사용성 향상

- ✅ **shadcn/ui 활용**
  - Dialog, Popover, ScrollArea 등 고품질 UI 컴포넌트를 커스터마이징하여 사용
  - 일관된 디자인 시스템 구축 및 개발 속도 향상

- ✅ **STOMP 기반 실시간 채팅**
  - `SockJS + STOMP`를 이용한 WebSocket 연결
  - 프로젝트/업무별 자동 채팅방 생성
  - 메시지 구독, 발행, 에러 처리 및 연결 상태 관리
  - 구독/해제 시점을 제어하여 불필요한 네트워크 요청 최소화

- ✅ **TailwindCSS 커스텀 컬러 시스템**
  - 브랜드 컬러: `#009BB0`
  - `mainColor`, `sub1`, `btnGray` 등으로 테마화


## 📸 서비스 주요 화면 
<img width="1902" height="913" alt="스크린샷 2025-12-27 오전 12 56 11" src="https://github.com/user-attachments/assets/423ceb52-8bff-4baa-9f13-328a34e5259d" />


## 🧑‍💼 프론트엔드 팀원 구성

| 역할 | 이름 | 담당 업무 |
|------|------|------------|
| Frontend | 이민정 | UI/UX, 공통 컴포넌트, Auth/Comment/Stomp 
| Frontend | 김민기 | UI/UX, 공통 컴포넌트, Project/Task/DnD

공통 컴포넌트 만들고 page 별로 UI 작업을 진행하였으며 API 완성 후 각각 기능을 맡아 API 연결하여 기능 구현

**FE 업무 분담**
https://amazing-duke-073.notion.site/taskon-frontend


## 🛎️ Swagger
https://api.taskon.co.kr/swagger-ui/index.html
