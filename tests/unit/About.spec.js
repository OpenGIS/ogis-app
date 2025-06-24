import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import About from "@/components/UI/Menu/About.vue";

describe("About.vue", () => {
  // Helper function to mount the component
  const mountAbout = () => {
    return mount(About);
  };

  it("renders correctly with title element", () => {
    const wrapper = mountAbout();

    // Check title
    expect(wrapper.find("h2").text()).toBe("Open GIS");
  });

  it("has a popup container", () => {
    const wrapper = mountAbout();

    // Check that the about popup container exists
    expect(wrapper.find(".about-popup").exists()).toBe(true);
  });
});
