export const handleError = (error: Error, componentName: string) => {
  console.error(`Error in ${componentName}:`, error);
  // Можно добавить отправку в систему мониторинга
};

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return function WithErrorBoundary(props: P) {
    try {
      return <Component {...props} />;
    } catch (error) {
      handleError(error as Error, componentName);
      return null;
    }
  };
}; 