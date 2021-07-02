import Tag from '../models/Tag'
import mqtt from 'mqtt'

export const createTag = async (req, res) => {
    try {
        const options = {
          clientId: 'API-TAG-SERVER',
          username: 'ServerNode',
          password: ''
        }

        const connectUrl = 'ws://143.198.128.180:8083/mqtt'
        const client = mqtt.connect(connectUrl, options)
        client.on('connect', () => {
          console.log('Client connected by SERVER:')
          // Subscribe
          client.subscribe('mina/subterranea/worker/#', { qos: 0 })
        })

        client.on('message', async (topic, message) => {
          const tracking = JSON.parse(message.toString())
          console.log(tracking)
        })
        return res.status(200).json({
            saved: true
        })
    } catch (error) {
        console.error(error)
    }
}