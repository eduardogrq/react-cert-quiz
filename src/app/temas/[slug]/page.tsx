import { notFound } from 'next/navigation';
import { getTopicById, getTopicIds } from '@/content/index';
import { TopicViewClient } from './TopicViewClient';

export function generateStaticParams() {
  return getTopicIds().map((id) => ({ slug: id }));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicById(slug);

  if (!topic) {
    notFound();
  }

  return <TopicViewClient topic={topic} />;
}
