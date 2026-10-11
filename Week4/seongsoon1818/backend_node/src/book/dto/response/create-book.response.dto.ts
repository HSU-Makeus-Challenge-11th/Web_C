export class CreateBookResponseDto {
  bookId: number;
  message: string;

  constructor(bookId: number) {
    this.bookId = bookId;
    this.message = '도서 등록이 완료되었습니다!';
  }
}
