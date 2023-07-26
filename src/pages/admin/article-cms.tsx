import { DummyContent } from '~/component/dummy-content';
import { ContentLayout } from '~/layout/index';

export default function ArticleCMS() {
  return (
    <ContentLayout type='admin' title='Article CMS'>
      <DummyContent title='Article CMS' />
    </ContentLayout>
  );
}
