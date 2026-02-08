type LoadingSpinnerProps = {
  size?: number;
};

export default function LoadingSpinner({ size = 20 }: LoadingSpinnerProps) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-white border-t-transparent"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
