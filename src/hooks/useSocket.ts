import { useEffect, useRef} from 'react'
import io, {ManagerOptions, SocketOptions, Socket}  from 'socket.io-client'

export const useSocket = (uri: string, otps?: Partial<ManagerOptions & SocketOptions> | undefined): Socket => {
  const {current: socket} = useRef(io(uri, otps))

  useEffect(()=>{
    return () => {
      if(socket) {
        console.log(socket)
        socket.close()
      }
    }
  }, [socket])

  return socket
}