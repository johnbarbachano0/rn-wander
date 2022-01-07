class Place {
  constructor(
    id,
    title,
    description,
    visitAt,
    address,
    createdBy,
    createdAt,
    updatedAt,
    image,
    latitude,
    longitude,
    locationUri
  ) {
    (this.id = id),
      (this.title = title),
      (this.description = description),
      (this.visitAt = visitAt),
      (this.address = address),
      (this.image = image),
      (this.latitude = latitude),
      (this.longitude = longitude),
      (this.createdBy = createdBy),
      (this.createdAt = createdAt),
      (this.updatedAt = updatedAt),
      (this.locationUri = locationUri);
  }
}

export default Place;
