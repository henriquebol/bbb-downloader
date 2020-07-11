require "trollop"
require 'rest-client'
require File.expand_path('../../../lib/recordandplayback', __FILE__)

opts = Trollop::options do
  opt :meeting_id, "Meeting id to archive", :type => String
end
meeting_id = opts[:meeting_id]

logger = Logger.new("/var/log/bigbluebutton/post_publish.log", 'weekly' )
logger.level = Logger::INFO
BigBlueButton.logger = logger

#published_files = "/var/bigbluebutton/published/presentation/#{meeting_id}"
meeting_metadata = BigBlueButton::Events.get_meeting_metadata("/var/bigbluebutton/recording/raw/#{meeting_id}/events.xml")

BigBlueButton.logger.info("Starting Downloader - wait 10 minutes")
sleep(600)

begin
  permit_download = meeting_metadata["download"].value
  BigBlueButton.logger.info(permit_download)

  if (permit_download.to_s == "true")
    host = meeting_metadata["bbb-origin-server-name"].value
    email = meeting_metadata["email"].value
    address = ''
    url = 'https://' + host + '/playback/presentation/2.0/playback.html?meetingId=' + meeting_id
    resp = RestClient.get "#{address}email=#{email}&url=#{url}"
    BigBlueButton.logger.info("#{address}email=#{email}&url=#{url}")
    BigBlueButton.logger.info(resp.body)
  end

rescue => e
  BigBlueButton.logger.info("Rescued")
  BigBlueButton.logger.info(e.to_s)
end
