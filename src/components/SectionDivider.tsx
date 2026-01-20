const SectionDivider = () => {
  return (
    <div className="relative h-px w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/30" />
    </div>
  );
};

export default SectionDivider;