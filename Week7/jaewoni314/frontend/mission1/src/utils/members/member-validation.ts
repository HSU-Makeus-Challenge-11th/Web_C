// 회원가입, 로그인, 내 정보 수정 화면이 같은 입력 규칙을 쓰도록 한곳에 모아 둬요.
// 서버(CreateMemberDto)의 검증 규칙과 맞춰요.

// 입력값 전체가 형식에 맞는지 검사하므로 g 플래그를 붙이지 않아요.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const EMAIL_MAX_LENGTH = 254;
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 12;

export const MEMBER_INPUT_ERROR_MESSAGES = {
  email: "올바른 이메일 형식으로 입력해 주세요.",
  nickname: `닉네임은 ${NICKNAME_MIN_LENGTH}자 이상 ${NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요.`,
  password: "영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.",
  passwordConfirm: "비밀번호가 일치하지 않아요.",
} as const;

// 이메일과 닉네임은 앞뒤 공백을 지운 값(trim)을 넘겨 주세요.
export function isValidEmail(email: string) {
  return email.length <= EMAIL_MAX_LENGTH && EMAIL_REGEX.test(email);
}

export function isValidNickname(nickname: string) {
  return nickname.length >= NICKNAME_MIN_LENGTH && nickname.length <= NICKNAME_MAX_LENGTH;
}

export function isValidPassword(password: string) {
  return PASSWORD_REGEX.test(password);
}
