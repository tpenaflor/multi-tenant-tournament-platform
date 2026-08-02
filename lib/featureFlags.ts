export function isAiComponentEnabled(): boolean {
  // Defaults to true unless explicitly disabled via environment variable
  const flag = process.env.NEXT_PUBLIC_ENABLE_AI_BUILDER_COMPONENT;
  if (flag === 'false' || flag === '0') {
    return false;
  }
  return true;
}
