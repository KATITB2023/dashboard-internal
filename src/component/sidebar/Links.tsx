import { Box, Flex, HStack, Text, Link, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IconFromImage } from '~/component/icon-from-image';

export interface SidebarRoute {
  name: string;
  path: string;
  component: any;
  iconPath: string;
}

export interface SidebarProps {
  routes: SidebarRoute[];
}

export function SidebarLinks(props: SidebarProps) {
  const { routes } = props;
  const router = useRouter();
  const purple = '#340C8F';
  const gray = '#363636';
  const white = '#F9F9F9';

  const activeRoute = (routeName: string) => {
    return router.pathname.includes(routeName);
  };

  const createLinks = (routes: SidebarRoute[]) => {
    return (
      <VStack spacing={2} alignItems={'start'}>
        {routes.map((route, index: number) => {
          return (
            <Link
              key={index}
              href={route.path}
              style={{ textDecoration: 'none' }}
              w='100%'
            >
              <Box
                bg={
                  activeRoute(route.path.toLowerCase()) ? white : 'transparent'
                }
                borderLeftRadius={25}
                pl={2}
                _hover={{
                  bg: activeRoute(route.path.toLowerCase()) ? white : gray
                }}
                py={1}
              >
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                  }
                  py='5px'
                  ps='10px'
                >
                  <Flex w='100%' alignItems='center' justifyContent='center'>
                    <Box me='18px'>
                      <IconFromImage
                        imagePath={
                          activeRoute(route.path.toLowerCase())
                            ? route.iconPath + 'purple.svg'
                            : route.iconPath + 'white.svg'
                        }
                        size={20}
                        alt={route.name}
                      />
                    </Box>
                    <Text
                      me='auto'
                      color={
                        activeRoute(route.path.toLowerCase()) ? purple : 'white'
                      }
                      fontWeight='bold'
                    >
                      {route.name}
                    </Text>
                  </Flex>
                </HStack>
              </Box>
            </Link>
          );
        })}
      </VStack>
    );
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
