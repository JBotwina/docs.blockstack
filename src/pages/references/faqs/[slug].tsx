import React from 'react';
import { Components } from '@components/mdx';
import { Box, Flex, ChevronIcon, space, color, Grid } from '@blockstack/ui';
import hydrate from 'next-mdx-remote/hydrate';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@reach/accordion';
import { border } from '@common/utils';
import { css } from '@styled-system/css';
import { useRouter } from 'next/router';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import { BackButton } from '@components/back-button';
import Head from 'next/head';
import { MDContents } from '@components/mdx/md-contents';
export { getStaticProps, getStaticPaths } from '@common/data/faq';
import { slugify } from '@common/utils';
import { PageTop } from '@components/page-top';

const getBetterNames = (id: number) => {
  switch (id) {
    case 360007620914:
      return {
        title: 'General information',
        description: 'General questions about Blockstack and the Stacks network',
        img: '/images/pages/testnet.svg',
      };
    case 360007411853:
      return {
        title: 'Stacks Token',
        description: 'Questions relating to the native token of Stacks 2.0',
        img: '/images/pages/mining.svg',
      };
    case 360007760554:
      return {
        title: 'Stacks blockchain',
        description: 'Learn about the blockchain and details of Stacks 2.0',
        img: '/images/pages/hello-world.svg',
      };
    case 360007781533:
      return {
        title: 'Ecosystem details',
        description: 'Questions related to the age of the project and the contributors',
        img: '/images/pages/data-storage.svg',
      };
    case 360007780033:
      return {
        title: 'Building apps',
        description: 'Learn about the platform and questions related to decentralized applications',
        img: '/images/pages/connect.svg',
      };
  }
};

const getSlug = (asPath: string) => {
  if (asPath.includes('#')) {
    const slug = asPath.split('#')[1];
    return slug;
  }
  return;
};

const FAQItem = React.memo(({ faq, ...rest }: any) => {
  const id = slugify(faq.title);
  const { isActive } = useActiveHeading(id);

  return (
    <Box as={AccordionItem} borderBottom={border()} {...rest}>
      <Flex
        as={AccordionButton}
        _hover={{ color: color('accent') }}
        css={css({
          display: 'flex',
          width: '100%',
          outline: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: space('extra-loose'),
          textAlign: 'left',
          color: isActive ? color('accent') : color('text-title'),
          ':hover': {
            color: color('accent'),
          },
        })}
      >
        <Components.h4 my="0px !important" color="currentColor">
          {faq.title}
        </Components.h4>
        <Box color={color('text-caption')} pl={space('base-loose')}>
          <ChevronIcon direction="down" size="22px" />
        </Box>
      </Flex>
      <Box pb={space('extra-loose')} as={AccordionPanel}>
        {hydrate(faq.body, Components)}
      </Box>
    </Box>
  );
});

const FaqItems = ({ articles }) => {
  const router = useRouter();
  const slug = getSlug(router.asPath);
  const slugIndex = articles.findIndex(faq => slugify(faq.title) === slug);
  const [index, setIndex] = React.useState(slugIndex !== -1 ? slugIndex : 0);
  const handleIndexChange = (value: number) => {
    setIndex(value);
  };

  return (
    <Box
      pr={['extra-loose', 'extra-loose', 'base-loose', 'base-loose']}
      pl={['extra-loose', 'extra-loose', '0', '0']}
    >
      <BackButton href="/references/faqs" mb={0} />
      <Accordion multiple collapsible defaultIndex={index} onChange={handleIndexChange}>
        {articles
          // @ts-ignore
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((faq, _index) => {
            return <FAQItem faq={faq} key={_index} />;
          })}
      </Accordion>
    </Box>
  );
};

const FaqPage = props => {
  const { articles, sections, params } = props;

  const section = sections.find(s => {
    const { title } = getBetterNames(s.id);
    const slug = slugify(title);
    return slug === params.slug;
  });

  const { title, description } = getBetterNames(section.id);
  return (
    <>
      <Head>
        <title>{title} | Blockstack</title>
        <meta name="description" content={description} />
      </Head>
      <MDContents pageTop={() => <PageTop title={title} description={description} />} headings={[]}>
        <FaqItems articles={articles} />
      </MDContents>
    </>
  );
};

export default FaqPage;
