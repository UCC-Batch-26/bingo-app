export function SampleViewSkeleton() {
  return (
    <div className="grid gap-2">
      <div className="h-6 w-4/12 bg-gray-500 animate-pulse rounded-sm"></div>
      <div className="h-10 w-7/12 bg-gray-500 animate-pulse rounded-sm"></div>
      <div className="h-6 w-6/12 bg-gray-500 animate-pulse rounded-sm"></div>
    </div>
  );
}

export function SampleView({ id, name, createdAt }) {
  const readableCreatedAt = !createdAt
    ? ''
    : new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(createdAt));

  return (
    <div>
      <div>{id}</div>
      <h1 className="text-3xl">{name}</h1>
      <p>Created At: {readableCreatedAt}</p>
    </div>
  );
}
