import { DummyContent } from '~/component/dummy-content';
import { ContentLayout } from '~/layout/index';

export default function GroupInformation() {
  return (
    <ContentLayout type='admin' title='Group Information'>
      <DummyContent title='Group Information' />
    </ContentLayout>
  );
}
