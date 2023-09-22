class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //메시지 프로퍼티 추가
    this.code = errorCode; //코드 프로퍼티 추가
  }
}

module.exports = HttpError;
