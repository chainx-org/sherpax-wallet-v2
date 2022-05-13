import moment from 'moment'


export default function changeTime(content:number) {

  if (content < Math.pow(10, 12)) {
    content = content * 1000
  }

  let duration: string = ''
  let stopTime = new Date().getTime()
  let startTime = content
  let second = moment.duration(moment(stopTime).valueOf() - moment(startTime).valueOf()).as('seconds')
  let days = Math.floor(second / 86400)
  let hours = Math.floor((second % 86400) / 3600)
  let minutes = Math.floor(((second % 86400) % 3600) / 60)
  let seconds = Math.floor(((second % 86400) % 3600) % 60)
  if (days > 0) {
    duration = moment(Number(content)).utc().format('MMM-DD-YYYY hh:mm:ss A') + ' +UTC'
  } else if (hours > 0) duration = ' ' + hours + ' ' + 'hrs' + ' ' + minutes + ' ' + 'min' + ' ' + 'ago'
  else if (minutes > 0) duration = ' ' + minutes + ' ' + 'min' + ' ' + seconds + ' ' + 'sec' + ' ' + 'ago'
  else if (seconds > 0) duration = ' ' + seconds + ' ' + 'sec' + ' ' + 'ago'


  return duration
}
