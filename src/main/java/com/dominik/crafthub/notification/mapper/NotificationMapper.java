package com.dominik.crafthub.notification.mapper;

import com.dominik.crafthub.notification.dto.NotificationDto;
import com.dominik.crafthub.notification.entity.NotificationEntity;
import com.dominik.crafthub.notification.entity.NotificationPayload;
import com.dominik.crafthub.notification.entity.NotificationTypeEnum;
import com.dominik.crafthub.user.entity.UserEntity;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface NotificationMapper {
  NotificationDto toDo(NotificationEntity notificationEntity);

  @Mapping(source = "createdAt", target = "createdAt")
  @Mapping(target = "id", ignore = true)
  NotificationEntity toEntity(
      OffsetDateTime createdAt,
      NotificationTypeEnum type,
      NotificationPayload data,
      Boolean isRead,
      UserEntity user);
}
