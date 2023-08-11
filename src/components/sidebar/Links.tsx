import {
  Box,
  Flex,
  HStack,
  Text,
  Link,
  VStack,
  Icon,
  Center
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons/lib';

export interface SidebarRoute {
  name: string;
  path: string;
  component: React.ReactNode;
  icon: IconType;
}

export interface SidebarProps {
  routes: SidebarRoute[];
}

export function SidebarLinks(props: SidebarProps) {
  const { routes } = props;
  const router = useRouter();
  const purple = '#340C8F';
  const white = '#F9F9F9';

  const activeRoute = (routeName: string) => {
    return router.pathname.includes(routeName);
  };

  const createLinks = (routes: SidebarRoute[]) => {
    return (
      <VStack spacing={1} alignItems={'start'}>
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
                color={activeRoute(route.path.toLowerCase()) ? purple : white}
                _hover={{ bg: white, color: purple }}
                py={1}
                role='group'
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
                      <Center>
                        <Icon
                          as={route.icon}
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? purple
                              : white
                          }
                          _groupHover={{ color: purple }}
                          width='18px'
                          height='18px'
                        ></Icon>
                      </Center>
                    </Box>
                    <Text me='auto' fontWeight='bold'>
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
