export interface FrigadeProviderProps {
  children: React.ReactNode;
  publicApiKey?: string;
}

export const FrigadeProvider = ({
                                  publicApiKey,
                                  ...props
                                  }: FrigadeProviderProps) => {
  const {children} = props;

  return (
    <>
      {children}
    </>
  )
}