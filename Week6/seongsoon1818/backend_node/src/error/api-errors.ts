export const API_ERRORS = {
  duplicateEmail: {
    code: 'MEMBER_EMAIL_DUPLICATE',
    message: '이미 사용 중인 이메일입니다.',
  },
  duplicateNickname: {
    code: 'MEMBER_NICKNAME_DUPLICATE',
    message: '이미 사용 중인 닉네임입니다.',
  },
  duplicateRating: {
    code: 'RATING_DUPLICATE',
    message: '이미 이 영화에 평점을 남기셨습니다.',
  },
  duplicateData: {
    code: 'DATA_DUPLICATE',
    message: '이미 존재하는 데이터입니다.',
  },
} as const;
