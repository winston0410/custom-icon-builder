import {
  cleanupSVG,
  exportIconPackage,
  importDirectory,
  isEmptyColor,
  parseColors,
  runSVGO,
} from "@iconify/tools";

(async () => {
  // Merge icon if needed https://iconify.design/docs/libraries/tools/icon-set/merge.html
  const iconSet = await importDirectory(
    "./node_modules/svg-credit-card-payment-icons/flat-rounded",
    {
      prefix: "credit-card-flat-rounded",
    },
  );

  // Validate, clean up, fix palette and optimise
  await iconSet.forEach(async (name, type) => {
    if (type !== "icon") {
      return;
    }

    const svg = iconSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      iconSet.remove(name);
      return;
    }

    // Clean up and optimise icons
    try {
      // Clean up icon code
      cleanupSVG(svg);

      // Optimise
      runSVGO(svg);
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err);
      iconSet.remove(name);
      return;
    }

    // Update icon
    iconSet.fromSVG(name, svg);
  });

  const target = `output/${iconSet.prefix}`;

  // Export package
  await exportIconPackage(iconSet, {
    target,
    module: true,
    package: {
      name: `custom-icon-sets`,
      version: "1.0.0"
    },
    cleanup: true
  });
  // Publish NPM package
})();
