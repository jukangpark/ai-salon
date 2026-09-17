// 페이지 공통 framer-motion 변형. 자식 등장 간격(stagger)만 페이지마다 달라서 함수로 받는다.
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export const stagger = (staggerChildren: number) => ({
  visible: { transition: { staggerChildren } },
});
