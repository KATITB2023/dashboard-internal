import { Box, Flex, HStack, Text, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IconFromImage } from '~/component/icon-from-image';

export interface SidebarRoute {
  name: string;
  layout: string;
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

  const activeRoute = (routeName: string) => {
    return router.pathname.includes(routeName);
  };

  const createLinks = (routes: SidebarRoute[]) => {
    return routes.map((route, index: number) => {
      if (route.layout === '/admin' || route.layout === '/mentor') {
        return (
          <Link
            key={index}
            href={route.layout + route.path}
            style={{ textDecoration: 'none' }}
          >
            <Box
              bg={
                activeRoute(route.path.toLowerCase()) ? 'white' : 'transparent'
              }
              borderLeftRadius={25}
              pl={2}
            >
              <HStack
                spacing={
                  activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                }
                py='5px'
                ps='10px'
              >
                <Flex w='100%' alignItems='center' justifyContent='center'>
                  <Box
                    color={
                      activeRoute(route.path.toLowerCase()) ? purple : 'white'
                    }
                    me='18px'
                  >
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
                <Box
                  h='36px'
                  w='4px'
                  bg={
                    activeRoute(route.path.toLowerCase())
                      ? 'white'
                      : 'transparent'
                  }
                  borderRadius='5px'
                />
              </HStack>
            </Box>
          </Link>
        );
      }
    });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
