import { isTableted } from "../common/utils";

// Font Sizes
const size = {
  superHeadline: isTableted ? 62 : 56,
  headline:  isTableted ? 42 : 36,
  subHeadline:  isTableted ? 32 : 26,
  title:  isTableted ? 30 : 24,
  subTitle:  isTableted ? 28 : 22,
  content:  isTableted ? 26 : 20,
  subContent:  isTableted ? 24 : 18,
  description: isTableted ? 22 : 16,
  subDescription: isTableted ? 20 : 14,
  tag: isTableted ? 18 : 12,
  subTag: isTableted ? 16 : 10
};

const fontFamily = {

}

// Font Size Classes
const Fonts = {
  // example
  // robotoRegular: {
  //   fontFamily: fontFamily.robotoRegular
  // },
  superHeadline: {
    fontSize: size.superHeadline
  },
  headline: {
    fontSize: size.headline
  },
  subHeadline: {
    fontSize: size.subHeadline
  },
  title: {
    fontSize: size.title
  },
  subTitle: {
    fontSize: size.subTitle
  },
  content: {
    fontSize: size.content
  },
  subContent: {
    fontSize: size.subContent
  },
  description: {
    fontSize: size.description
  },
  subDescription: {
    fontSize: size.subDescription
  },
  tag: {
    fontSize: size.tag
  },
  subTag: {
    fontSize: size.subTag
  }
};

// Make the Fonts available for the application
export { Fonts };
