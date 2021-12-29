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
    lat,
    lon
  ) {
    (this.id = id),
      (this.title = title),
      (this.description = description),
      (this.visitAt = visitAt),
      (this.address = address),
      (this.image = image),
      (this.lat = lat),
      (this.lon = lon),
      (this.createdBy = createdBy),
      (this.createdAt = createdAt),
      (this.updatedAt = updatedAt);
  }
}

export default Place;
