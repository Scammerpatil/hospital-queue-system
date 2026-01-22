package com.saket.hospital_queue_system.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMeetingLinkRequest {
  private String meetingLink;
  private String meetingPlatform; // GOOGLE_MEET, ZOOM, MICROSOFT_TEAMS, etc.
}
