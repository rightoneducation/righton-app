import React from "react";
import FeaturedMistakes from "./FeaturedMistakes";

export default {
  title: "FeaturedMistakes",
  component: FeaturedMistakes,
};
const Template = args => <FeaturedMistakes {...args} />;

export const Default = Template.bind({});
Default.args = {};
