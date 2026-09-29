import avatarPrimaryUrl from "../assets/images/isabella_sovereign_avatar_1786826317049.jpg";
import medallionImageUrl from "../assets/images/isabella_cinematic_medallion.jpg";
import portraitPrimeUrl from "../assets/images/isabella_portrait_prime_1786743839065.jpg";

export const ISABELLA_AVATAR_PRIMARY = avatarPrimaryUrl;
export const ISABELLA_MEDALLION_IMAGE = medallionImageUrl;

export const ISABELLA_PORTRAITS = [
  { src: avatarPrimaryUrl, title: "Avatar soberano" },
  { src: medallionImageUrl, title: "Medallón cinematográfico" },
  { src: portraitPrimeUrl, title: "Retrato primario" },
] as const;

export default ISABELLA_AVATAR_PRIMARY;
