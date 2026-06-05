import SectionHeading from '@/src/components/ui/SectionHeading';
import ViewAllLink from '@/src/components/ui/ViewAllLink';

function BestSellerHeader() {
  return (
    <SectionHeading
      eyebrow="Customer favourites"
      title="Best sellers"
      subtitle="Pieces our community returns to — refined staples and standout silhouettes."
      action={<ViewAllLink href="/shop" />}
      sx={{ mt: { xs: 0, md: 0 }, mb: { xs: 2, md: 3 } }}
    />
  );
}

export default BestSellerHeader;
