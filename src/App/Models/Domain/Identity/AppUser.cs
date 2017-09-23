﻿namespace App.Models.Domain.Identity {
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.ComponentModel.DataAnnotations;
    using Microsoft.AspNetCore.Identity;

    public class AppUserTrustedUser {
        public virtual AppUser TargetUser { get; set; }
        public virtual AppUser SourceUser { get; set; }

        public virtual int Id { get; set; }
    }

    public class AppUser : IdentityUser<int> {
        private ICollection<AppUserTrustedUser> _trustedUsers;

        [Required]
        public virtual AppOwner Group { get; set; }

        public int GroupId { get; set; }

        /// <summary>
        /// Gets a list of trusted app users the current user may impersonate.
        /// </summary>
        public virtual ICollection<AppUserTrustedUser> TrustedUsers {
            get { return this._trustedUsers ?? (this._trustedUsers = new Collection<AppUserTrustedUser>()); }
            set { this._trustedUsers = value; }
        }

        /// <summary>
        /// Constructor
        /// </summary>
        public AppUser() {}

        public static AppUser Create(string name, string email, AppOwner group) {
            return new AppUser {
                                   UserName = name,
                                   Email = email,
                                   Group = group
                               };
        }
    }

    public class AppUserLogin : IdentityUserLogin<int> {
        
    }

    public class AppUserRole : IdentityUserRole<int> {
        public virtual AppRole Role { get; set; }
        public virtual AppUser User { get; set; }
    }

    public class AppRole : IdentityRole<int> {
        public static class KnownRoles {
            public const string Administrator = "Administrator";
        }
        
    }

    public class AppUserClaim : IdentityUserClaim<int> {
        
    }
}