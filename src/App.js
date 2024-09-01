import { Suspense, useState, useTransition } from 'react';
import Layout from './components/layout';
import Welcome from './pages/welcome';
import Core from './pages/core';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function turnTo(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  switch (page) {
    case '/':
      content = (
        <Welcome turnTo={turnTo} />
      );
      break;
    case '/core':
      content = (
        <Core turnTo={turnTo} />
      );
      break;
    default:
      content = (
        <h1>404 Not Found</h1>
      );
  }

  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
