import { Suspense, useState, useTransition } from 'react';
import Layout from './components/layout';
import QuestionAndAnswer from './components/questionAndAnswer';
import Welcome from './pages/welcome';
import Core from './pages/core';
import Shelf from './pages/shelf';
import { message } from 'antd';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState(window.location.pathname);
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
        <Core turnTo={turnTo} />
      );
      break;
    case '/welcome':
      content = (
        <Welcome turnTo={turnTo} />
      );
      break;
    case '/core':
      content = (
        <Core turnTo={turnTo} />
      );
      break;
    case '/shelf':
      content = (
        <Shelf turnTo={turnTo} />
      );
      break;
    default:
      content = (
        <h1>404 Not Found</h1>
      );
  }

  return (
    <Layout isPending={isPending} turnTo={turnTo}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
