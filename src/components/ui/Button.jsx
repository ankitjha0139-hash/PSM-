const VARIANTS = {
  primary:
    'bg-indigo-900 text-cream hover:bg-indigo-800 active:bg-indigo-950 shadow-soft',
  ghost:
    'bg-white/60 text-indigo-900 border border-indigo-900/15 backdrop-blur-sm hover:bg-white/90 hover:border-indigo-900/25',
  sage: 'bg-sage-500 text-indigo-950 hover:bg-sage-600 hover:text-cream shadow-soft',
  outline:
    'bg-transparent text-indigo-900 border border-indigo-900/25 hover:bg-indigo-900/5',
}

export default function Button({
  as: Tag = 'a',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-tight transition-all duration-200 ease-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
