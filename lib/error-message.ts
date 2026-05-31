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

    // 로그에는 상세 메시지 출력, 사용자에게는 일반화된 메시지 보이기
    console.error('Detailed supabase error:', message);
    return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
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

    console.error('Detailed error:', message);
    return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

export default toUserFriendlyMessage;
