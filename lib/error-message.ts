type UnknownError = unknown;

export function toUserFriendlyMessage(err: UnknownError): string {
  if (!err) return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

  // Supabase 오류 객체 형태 검사
  if (typeof err === "object") {
    // @ts-ignore
    const code = (err as any).code || (err as any).status;
    // @ts-ignore
    const message = (err as any).message || String(err);

    if (code === 42501 || /row[- ]level security/i.test(message) || /permission/i.test(message)) {
      return "이 작업을 수행할 권한이 없습니다.";
    }

    if (/Failed to fetch/i.test(message) || /NetworkError/i.test(message)) {
      return "인터넷 연결을 확인해주세요.";
    }

    if (/not found/i.test(message) || /No rows found/i.test(message)) {
      return "요청한 내용을 찾을 수 없습니다.";
    }

    // 마지막으로 문자열으로 반환 가능한 메시지가 있으면 기본 안내로 사용
    return message || "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  if (typeof err === "string") {
    const message = err;

    if (message.includes("42501") || /row[- ]level security/i.test(message)) {
      return "이 작업을 수행할 권한이 없습니다.";
    }

    if (message.includes("Failed to fetch")) {
      return "인터넷 연결을 확인해주세요.";
    }

    if (/not found/i.test(message)) {
      return "요청한 내용을 찾을 수 없습니다.";
    }

    return message;
  }

  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

export default toUserFriendlyMessage;
