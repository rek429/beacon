type Props = { children: React.ReactNode };

export const FeedWrapper = ({ children }: Props) => (
  <div className="flex flex-col items-center flex-1 pb-10">{children}</div>
);
