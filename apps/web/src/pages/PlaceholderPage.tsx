type PlaceholderPageProps = {
  title: string;
  description: string;
};

export const PlaceholderPage = ({
  title,
  description,
}: PlaceholderPageProps) => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-gray-500">StudentOps</p>

      <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>

      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};
