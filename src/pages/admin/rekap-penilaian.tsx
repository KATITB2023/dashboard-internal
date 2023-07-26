import { DummyContent } from '~/component/dummy-content';
import { ContentLayout } from '~/layout/index';

export default function RekapPenilaian() {
  return (
    <ContentLayout type='admin' title='Rekap Penilaian'>
      <DummyContent title='Rekap Penilaian' />
    </ContentLayout>
  );
}
