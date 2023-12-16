import { Container, useMantineColorScheme } from '@mantine/core'
import React from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'

const HomePage = () => {
  return (
    <Container maw="100vw" style={{overflowX:"hidden"}} p="0" h="100vh">
      <NavBar />
      <Outlet/>
    </Container>
  )
}

export default HomePage