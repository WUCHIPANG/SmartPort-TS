// 讓 TS 認得這些 deep import 的語系模組
declare module 'element-plus/es/locale/lang/*' {
  const locale: any
  export default locale
}