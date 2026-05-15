type EmptyBucketProps = {
  message: string;
};

export function EmptyBucket({ message }: EmptyBucketProps) {
  return (
    <div className="rounded-md border border-dashed border-border-subtle bg-bg-canvas px-3 py-4 text-sm leading-6 text-text-muted">
      {message}
    </div>
  );
}
