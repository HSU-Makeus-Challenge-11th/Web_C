# 🍀 HSU UMC 11th Web 🍀

여기 온 순간부터 여러분은 나가지 못 합니다.<br>
언제까지?<br>
<b><i>웹 마스터가 될 때까지…</i></b><br>


## 👤 스터디원

| <img src="https://avatars.githubusercontent.com/seongsoon1818" width=100> | <img src="https://avatars.githubusercontent.com/jaewoni314" width=100> | <img src="https://avatars.githubusercontent.com/satokitoki" width=100>|
| :--: | :--: | :--: |
| [성순/이성진](https://github.com/seongsoon1818) | [워니/김재원](https://github.com/jaewoni314) | [사토/김민주](https://github.com/satokitoki) |
| <img src="https://avatars.githubusercontent.com/taehwanlee203" width=100> | <img src="https://avatars.githubusercontent.com/jh-lee0" width=100> | <img src="https://avatars.githubusercontent.com/leedong0923" width=100> |
| [알라/이태환](https://github.com/taehwanlee203) | [이든/이준환](https://github.com/jh-lee0) | [무브/이동한](https://github.com/leedong0923) |

## 💫commit 태그

| 태그     | 설명                                   |
| -------- | -------------------------------------- |
| feat     | 새로운 기능 추가                       |
| fix      | 버그 수정                              |
| refactor | 코드 리팩토링                          |
| comment  | 주석 추가(코드 변경 X) 혹은 오타 수정  |
| docs     | README와 같은 문서 수정                |
| setting  | 프로젝트 세팅                          |
| merge    | merge                                  |
| test     | 테스트 코드, 리팩토링 테스트 코드 추가 |
| rename   | 파일, 폴더명 수정 혹은 이동            |
| remove   | 파일을 삭제만 한 경우                  |
## 📋 목차
- [주의사항](#-주의사항)
- [작업 방식](#-작업-방식)
- [폴더 구조](#-폴더-구조)
- [GitHub 사용 방법](#-github-사용-방법)

---

## ⚠️ 주의사항

### 1. .gitkeep 파일 관리
- **절대 .gitkeep 파일을 삭제하지 마세요**
- 빈 폴더를 Git에서 관리하기 위해 필요한 파일입니다

### 2. 브랜치 관리
- main 브랜치에서 직접 작업하지 마세요
- 반드시 본인의 브랜치에서만 작업합니다
- 다른 사람의 브랜치를 임의로 수정하지 마세요

### 3. 머지 규칙
- 피드백이 완전히 반영되기 전까지 머지하지 마세요
- 승인 없이 다른 사람의 PR을 머지하지 마세요

---

## 🔄 작업 방식

### 1단계: 이슈 및 브랜치 생성
```bash
# main 브랜치 기반으로 본인 GitHub 닉네임으로 브랜치 생성
git checkout main
git pull origin main
git checkout -b <본인-GitHub-닉네임/주차>
```

### 2단계: 작업 수행
- 본인 브랜치에서만 작업합니다
- 주차별 미션을 수행하고 커밋합니다

### 3단계: PR(Pull Request) 생성
- main 브랜치로 PR을 올립니다
- PR 제목: `[Week00] 본인이름 - 미션제목`
- 예시: [Week07] 이성진 - Practice1, Mission1, 2, 3
### 4단계: 피드백 반영 및 머지
1. 리뷰어의 피드백을 받습니다
2. 피드백 내용을 반영하여 수정합니다
3. 모든 피드백이 반영되면 **스스로 머지**합니다

### 5단계: 다음 주차 준비
```bash
# main 브랜치에서 최신 내용 pull
git checkout main
git pull origin main

# 본인 브랜치로 이동하여 main 내용 반영
git checkout <본인-GitHub-닉네임/주차>
git merge main
```

---

## 📁 폴더 구조

### 기본 구조
```
Week00/
├── <본인-GitHub-닉네임>/
|	└── frontend
│   	├── practice/          # 키워드 실습 파일
│   	├── mission1/          # 미션 1 관련 파일
│   	├── mission2/          # 미션 2 관련 파일
│   	└── ...
|	└── backend
│   	├── practice/          # 키워드 실습 파일
│   	├── mission1/          # 미션 1 관련 파일
│   	├── mission2/          # 미션 2 관련 파일
│   	└── ...
├── .gitkeep
Week01/
├── <본인-GitHub-닉네임>/
|	└── frontend
│   	├── practice/
│   	├── mission1/
│   	├── mission2/
│   	└── ...
|	└── backend
│   	├── practice/
│   	├── mission1/
│   	├── mission2/
│   	└── ...
├── .gitkeep
...
```

### 폴더 생성 규칙
1. **주차 폴더**: Week00 ~ Week10(이미 만들어 두었으니 건들지 마세요!)
2. **개인 폴더**: 본인의 GitHub 닉네임으로 생성(이 폴더부터 주차 폴더 아래에 생성해서 PR 올리시면 됩니다!)
3. **practice 폴더**: 키워드 학습 시 실습한 내용 저장
4. **미션 폴더**: 각 미션 번호에 맞게 생성 (mission1, mission2, ...)

---

## 📖 GitHub 사용 방법

상세한 GitHub 사용 방법(브랜치 생성, PR 작성, 머지 등)은 별도로 전달 예정입니다.

### 기본 Git 명령어
```bash
# 현재 브랜치 확인
git branch

# 변경사항 확인
git status

# 파일 추가
git add .

# 커밋
git commit -m "커밋 메시지"

# 푸시
git push origin <본인-브랜치명/주차>
```

---

## 📌 참고사항

- 질문이나 문제가 있을 경우 스터디 채널에 공유해주세요
- 코드 리뷰는 서로 배우는 과정이니 적극적으로 참여해주세요
- 커밋 메시지는 명확하고 간결하게 작성해주세요

---
